import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/Character';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/inventory/html/index.html`;
let view: View;
let isOpen = false;

export class InventoryController {
    static async handleView() {
        view = await View.getInstance(url, true, false, true);
        view.on('atm:Ready', handleReady);
        view.on('atm:Close', handleClose);
        alt.toggleGameControls(false);
        isOpen = true;
    }
}

function handleReady() {
    // Emit the inventory to the view.
}

function handleClose() {
    isOpen = false;
    alt.toggleGameControls(true);

    if (!view) {
        return;
    }

    view.close();
}
