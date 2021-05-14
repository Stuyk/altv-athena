import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/Character';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleController } from '../../../shared/locale/locale';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/atm/html/index.html`;
let view: View;
let isOpen = false;

alt.onServer(SYSTEM_EVENTS.INTERACTION_ATM, handleView);
alt.on(SYSTEM_EVENTS.META_CHANGED, handleChange);

async function handleView(_characters: Partial<Character>[]) {
    if (alt.Player.local.isPhoneOpen) {
        return;
    }

    view = await View.getInstance(url, true, false, true);
    view.on('atm:Ready', handleReady);
    view.on('atm:Close', handleClose);
    view.on('atm:Action', handleAction);
    alt.toggleGameControls(false);
    isOpen = true;
}

function handleAction(type, amount, id = null) {
    alt.emitServer(SYSTEM_EVENTS.INTERACTION_ATM_ACTION, type, amount, id);
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
    view.emit('atm:SetLocale', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_ATM));
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
