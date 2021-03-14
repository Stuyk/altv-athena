import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../../shared/configurations/shared';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Inventory } from '../../../shared/enums/views';
import { DroppedItem } from '../../../shared/interfaces/Item';
import { distance2d } from '../../../shared/utility/vector';
import { View } from '../../extensions/view';
import { drawMarker } from '../../utility/marker';
import { isAnyMenuOpen } from '../../utility/menus';
import { sleep } from '../../utility/sleep';
import { waitFor } from '../../utility/wait';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const url = `http://127.0.0.1:5500/src/core/client/views/inventory/html/index.html`;
// const url = `http://resource/client/views/inventory/html/index.html`;
let ped = null;
let view: View;
let camera;
let equipmentSize;
let lastDroppedItems: Array<DroppedItem> = [];

export class InventoryController {
    static isOpen = false;
    static drawInterval: number = null;

    static async handleView() {
        if (isAnyMenuOpen()) {
            return;
        }

        if (alt.Player.local.isPhoneOpen) {
            return;
        }

        view = await View.getInstance(url, true, false, false);
        view.on('inventory:Update', InventoryController.updateEverything);
        view.on('inventory:Use', InventoryController.handleUse);
        view.on('inventory:Process', InventoryController.handleProcess);
        view.on('inventory:Close', InventoryController.handleClose);
        alt.toggleGameControls(false);
        InventoryController.isOpen = true;
    }

    static handleProcess({ selectedSlot, endSlot, tab, hash }): void {
        alt.emitServer(View_Events_Inventory.Process, selectedSlot, endSlot, tab, hash);
    }

    static async updateEverything(): Promise<void> {
        if (!view) {
            return;
        }

        Object.keys(keyFunctions).forEach((key) => {
            keyFunctions[key]();
        });

        InventoryController.processClosestGroundItems();
        InventoryController.updatePlayerModelPreview();
    }

    static async updatePlayerModelPreview() {
        const screenshot = await InventoryController.takePedScreenshot();
        view.emit('inventory:Screenshot', screenshot);
    }

    static updateInventory(): void {
        if (!view) {
            return;
        }

        view.emit('inventory:Inventory', alt.Player.local.meta.inventory);
    }

    static async updateEquipment(): Promise<void> {
        if (!view) {
            return;
        }

        if (equipmentSize === undefined || equipmentSize === null) {
            equipmentSize = alt.Player.local.meta.equipment.length;
            InventoryController.updatePlayerModelPreview();
        } else {
            if (
                equipmentSize < alt.Player.local.meta.equipment.length ||
                equipmentSize > alt.Player.local.meta.equipment.length
            ) {
                InventoryController.updatePlayerModelPreview();
                equipmentSize = alt.Player.local.meta.equipment.length;
            }
        }

        view.emit('inventory:Equipment', alt.Player.local.meta.equipment);
    }

    static updateToolbar(): void {
        if (!view) {
            return;
        }

        view.emit('inventory:Toolbar', alt.Player.local.meta.toolbar);
    }

    static handleUse(selectedSlot: string, tab: number): void {
        alt.emitServer(View_Events_Inventory.Use, selectedSlot, tab);
    }

    static handleClose(): void {
        InventoryController.isOpen = false;
        alt.toggleGameControls(true);
        native.renderScriptCams(false, false, 255, true, false, 0);
        native.setCamActive(camera, false);
        native.destroyAllCams(true);

        if (!view) {
            return;
        }

        view.close();
    }

    static processMetaChange(key: string, value: any, oldValue: any): void {
        // Weed out the keys we don't care about.
        if (!validKeys.includes(key)) {
            return;
        }

        if (!keyFunctions[key]) {
            return;
        }

        keyFunctions[key]();
    }

    static updateGroundItems(items: Array<DroppedItem>) {
        lastDroppedItems = items;

        if (InventoryController.drawInterval) {
            alt.clearInterval(InventoryController.drawInterval);
            InventoryController.drawInterval = null;
        }

        if (lastDroppedItems.length >= 1) {
            InventoryController.drawInterval = alt.setInterval(InventoryController.drawItemMarkers, 0);
        }

        if (!view) {
            return;
        }

        if (!InventoryController.isOpen) {
            return;
        }

        alt.setTimeout(InventoryController.processClosestGroundItems, 0);
    }

    static processClosestGroundItems() {
        let itemsNearPlayer = lastDroppedItems.filter(
            (item) => distance2d(item.position, alt.Player.local.pos) <= SHARED_CONFIG.MAX_PICKUP_RANGE
        );

        if (alt.Player.local.vehicle) {
            itemsNearPlayer = [];
        }

        view.emit('inventory:Ground', itemsNearPlayer);
    }

    static drawItemMarkers() {
        for (let i = 0; i < lastDroppedItems.length; i++) {
            const groundItem = lastDroppedItems[i];
            const newPosition = {
                x: groundItem.position.x,
                y: groundItem.position.y,
                z: groundItem.position.z - 0.98
            };

            drawMarker(
                28,
                newPosition as alt.Vector3,
                new alt.Vector3(0.25, 0.25, 0.25),
                new alt.RGBA(0, 181, 204, 200)
            );
        }
    }

    static async takePedScreenshot(): Promise<string> {
        if (alt.Player.local.vehicle) {
            return null;
        }

        const fwd = native.getEntityForwardVector(alt.Player.local.scriptID);
        const pos = alt.Player.local.pos;
        const fwdPos = {
            x: pos.x + fwd.x * 2,
            y: pos.y + fwd.y * 2,
            z: pos.z + fwd.z
        };

        const fov = 90;
        camera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            fwdPos.x,
            fwdPos.y,
            fwdPos.z,
            0,
            0,
            0,
            fov,
            true,
            0
        );

        native.pointCamAtEntity(camera, alt.Player.local.scriptID, 0, 0, 0, false);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, false);

        await waitFor(native.isCamRendering, camera);

        const screenshot = await alt.takeScreenshotGameOnly();

        await waitFor(native.isCamRendering, camera);

        native.renderScriptCams(false, false, 255, true, false, 0);
        native.setCamActive(camera, false);
        native.destroyAllCams(true);
        return screenshot;
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InventoryController.processMetaChange);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEMS, InventoryController.updateGroundItems);

const keyFunctions = {
    inventory: InventoryController.updateInventory,
    toolbar: InventoryController.updateToolbar,
    equipment: InventoryController.updateEquipment
};
