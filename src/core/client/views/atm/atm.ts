import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Meta } from '../../../shared/enums/meta';
import { System_Interaction } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/Character';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/atm/html/index.html`;
let view: View;
let isOpen = false;

alt.onServer(System_Interaction.ATM, handleView);
alt.on(Events_Meta.Changed, handleChange);

async function handleView(_characters: Partial<Character>[]) {
    view = await View.getInstance(url, true, false, true);
    view.on('atm:Ready', handleReady);
    view.on('atm:Close', handleClose);
    view.on('atm:Action', handleAction);
    alt.toggleGameControls(false);
    isOpen = true;
}

function handleAction(type, amount, id = null) {
    alt.emitServer(System_Interaction.ACTION, type, amount, id);
}

function handleClose() {
    isOpen = false;
    alt.toggleGameControls(true);

    if (!view) {
        return;
    }

    view.close();
}

function handleReady() {
    handleChange('bank', null, null);
}

function handleChange(key: string, newValue: any, oldValue: any) {
    if ((key !== 'bank' && key !== 'cash') || !isOpen) {
        return;
    }

    if (!view) {
        return;
    }

    view.emit('atm:Update', alt.Player.local.meta.bank, alt.Player.local.meta.cash);
}
