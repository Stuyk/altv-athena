import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { KEY_BINDS } from '../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Inventory } from '../../shared/enums/views';
import { DroppedItem } from '../../shared/interfaces/Item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { distance2d } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { drawMarker } from '../utility/marker';
import { isAnyMenuOpen } from '../utility/menus';
import { Timer } from '../utility/timers';
import { waitForFalse } from '../utility/wait';
import { BaseHUD } from './hud/hud';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const url = `http://assets/webview/client/inventory/index.html`;
let view: View;
let camera;
let lastDroppedItems: Array<DroppedItem> = [];
let drawInterval: number = null;

export class InventoryController implements ViewModel {
    /**
     * Register the keybind to the Keybind Controller.
     * Triggers opening the inventory when pressed.
     * @static
     * @memberof InventoryController
     */
    static registerKeybinds() {
        KeybindController.registerKeybind({ key: KEY_BINDS.INVENTORY, singlePress: InventoryController.open });
    }

    /**
     * Used to open the Inventory.
     * Checks if any other menus are open.
     * @static
     * @return {*}
     * @memberof InventoryController
     */
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        view = await View.getInstance(url, true, false, false);
        view.on('inventory:Update', InventoryController.ready);
        view.on('inventory:Use', InventoryController.handleUse);
        view.on('inventory:Process', InventoryController.handleProcess);
        view.on('inventory:Close', InventoryController.close);
        view.on('inventory:Split', InventoryController.handleSplit);
        view.on('inventory:Pickup', InventoryController.handlePickup);
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);
    }

    static handleProcess(selectedSlot, endSlot, page, hash): void {
        alt.emitServer(View_Events_Inventory.Process, selectedSlot, endSlot, page, hash);
    }

    static handlePickup(hash: string) {
        alt.emitServer(View_Events_Inventory.Pickup, hash);
    }

    static async ready(): Promise<void> {
        if (!view) {
            return;
        }

        Object.keys(keyFunctions).forEach((key) => {
            keyFunctions[key]();
        });

        InventoryController.processClosestGroundItems();
        const didRenderCamera = await InventoryController.showPreview();
        view.emit('inventory:DisablePreview', !didRenderCamera ? true : false);
        view.emit('inventory:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_INVENTORY));
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

    static handleSplit(selectedSlot: string, tab: number, amount: number): void {
        alt.emitServer(View_Events_Inventory.Split, selectedSlot, tab, amount);
    }

    static close(): void {
        native.clearFocus();
        alt.toggleGameControls(true);
        native.renderScriptCams(false, false, 255, true, false, 0);
        native.setCamActive(camera, false);
        native.destroyAllCams(true);
        native.setEntityVisible(alt.Player.local.scriptID, true, false);
        BaseHUD.setHudVisibility(true);

        if (!view) {
            return;
        }

        view.close();
        view = null;
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

        if (drawInterval) {
            Timer.clearInterval(drawInterval);
            drawInterval = null;
        }

        if (lastDroppedItems.length >= 1) {
            drawInterval = Timer.createInterval(InventoryController.drawItemMarkers, 0, 'inventory.ts');
        }

        if (!view) {
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

    static async showPreview(): Promise<boolean> {
        if (alt.Player.local.vehicle) {
            return false;
        }

        await waitForFalse(native.isPedWalking, alt.Player.local.scriptID);

        const fov = 80;
        const fwd = native.getEntityForwardVector(alt.Player.local.scriptID);
        const pos = { ...alt.Player.local.pos };
        const fwdPos = {
            x: pos.x + fwd.x * 1.75,
            y: pos.y + fwd.y * 1.75,
            z: pos.z + 0.2
        };

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
        native.renderScriptCams(true, false, 0, true, false, 0);
        return true;
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InventoryController.processMetaChange);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEMS, InventoryController.updateGroundItems);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InventoryController.registerKeybinds);

const keyFunctions = {
    inventory: InventoryController.updateInventory,
    toolbar: InventoryController.updateToolbar,
    equipment: InventoryController.updateEquipment
};
