import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

const url = `http://assets/webview/client/atm/index.html`;
let view: View;

class AtmView implements ViewModel {
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        view = await View.getInstance(url, true, false, true);
        view.on('atm:Ready', AtmView.ready);
        view.on('atm:Close', AtmView.close);
        view.on('atm:Action', AtmView.action);
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);
    }

    static close() {
        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);

        if (!view) {
            return;
        }

        view.close();
        view = null;
    }

    static ready() {
        AtmView.change('bank');
        view.emit('atm:SetLocale', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_ATM));
    }

    static action(type: string, amount: number, id = null) {
        alt.emitServer(SYSTEM_EVENTS.INTERACTION_ATM_ACTION, type, amount, id);
    }

    static change(key: string) {
        if (key !== 'bank' && key !== 'cash') {
            return;
        }

        if (!view) {
            return;
        }

        view.emit('atm:Update', alt.Player.local.meta.bank, alt.Player.local.meta.cash);
    }
}

alt.onServer(SYSTEM_EVENTS.INTERACTION_ATM, AtmView.open);
alt.on(SYSTEM_EVENTS.META_CHANGED, AtmView.change);
