import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { View_Events_Inventory } from '../../../shared/enums/views';
import { Character } from '../../../shared/interfaces/Character';
import { View } from '../../extensions/view';

const validKeys = ['inventory', 'equipment', 'toolbar'];
const url = `http://resource/client/views/inventory/html/index.html`;
let view: View;

export class InventoryController {
    static isOpen = false;

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

    static handleProcess(selectedSlot: string, endSlot: string, pageIndex: number): void {
        alt.emitServer(View_Events_Inventory.Process, selectedSlot, endSlot, pageIndex);
    }

    static updateEverything(): void {
        if (!view) {
            return;
        }

        Object.keys(keyFunctions).forEach((key) => {
            keyFunctions[key]();
        });
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
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InventoryController.processMetaChange);

const keyFunctions = {
    inventory: InventoryController.updateInventory,
    toolbar: InventoryController.updateToolbar,
    equipment: InventoryController.updateEquipment
};
