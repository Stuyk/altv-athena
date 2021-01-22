import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Inventory } from '../../../shared/enums/views';
import { DroppedItem } from '../../../shared/interfaces/Item';
import { distance2d } from '../../../shared/utility/vector';
import { View } from '../../extensions/view';
import { drawMarker } from '../../utility/marker';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const url = `http://resource/client/views/inventory/html/index.html`;
let view: View;
let lastDroppedItems: Array<DroppedItem> = [];

export class InventoryController {
    static isOpen = false;
    static drawInterval: number = null;

    static async handleView() {
        if (alt.Player.local.isChatOpen) {
            return;
        }

        view = await View.getInstance(url, true, false, true);
        view.on('inventory:Update', InventoryController.updateEverything);
        view.on('inventory:Process', InventoryController.handleProcess);
        view.on('inventory:Close', InventoryController.handleClose);
        alt.toggleGameControls(false);
        InventoryController.isOpen = true;
    }

    static handleProcess({ selectedSlot, endSlot, tab, hash }): void {
        alt.emitServer(View_Events_Inventory.Process, selectedSlot, endSlot, tab, hash);
    }

    static updateEverything(): void {
        if (!view) {
            return;
        }

        Object.keys(keyFunctions).forEach((key) => {
            keyFunctions[key]();
        });

        InventoryController.processClosestGroundItems();
    }

    static updateInventory(): void {
        if (!view) {
            return;
        }

        view.emit('inventory:Inventory', alt.Player.local.meta.inventory);
    }

    static updateEquipment(): void {
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

    static handleClose(): void {
        InventoryController.isOpen = false;
        alt.toggleGameControls(true);

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
        let itemsNearPlayer = lastDroppedItems.filter((item) => distance2d(item.position, alt.Player.local.pos) <= 10);

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
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InventoryController.processMetaChange);
alt.onServer(SYSTEM_EVENTS.POPULATE_ITEMS, InventoryController.updateGroundItems);

const keyFunctions = {
    inventory: InventoryController.updateInventory,
    toolbar: InventoryController.updateToolbar,
    equipment: InventoryController.updateEquipment
};
