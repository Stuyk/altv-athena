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
        view.on('inventory:Update', InventoryController.updateInventory);
        view.on('inventory:Process', InventoryController.handleProcess);
        view.on('inventory:Close', InventoryController.handleClose);
        alt.toggleGameControls(false);
        InventoryController.isOpen = true;
    }

    static handleProcess(selectedSlot: string, endSlot: string, pageIndex: number): void {
        alt.emitServer(View_Events_Inventory.Process, selectedSlot, endSlot, pageIndex);
    }

    static updateInventory(): void {
        if (!view) {
            return;
        }

        view.emit(
            'inventory:Process',
            alt.Player.local.meta.inventory,
            alt.Player.local.meta.equipment,
            alt.Player.local.meta.toolbar
        );
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

        InventoryController.updateInventory();
    }
}

alt.on(SYSTEM_EVENTS.META_CHANGED, InventoryController.processMetaChange);
