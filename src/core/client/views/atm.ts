import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

const PAGE_NAME = 'Atm';

class AtmView implements ViewModel {
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        const view = await WebViewController.get();
        view.on('atm:Ready', AtmView.ready);
        view.on('atm:Close', AtmView.close);
        view.on('atm:Action', AtmView.action);
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);
    }

    static async close() {
        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);

        const view = await WebViewController.get();
        view.off('atm:Ready', AtmView.ready);
        view.off('atm:Close', AtmView.close);
        view.off('atm:Action', AtmView.action);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);
    }

    static async ready() {
        AtmView.change('bank');
        const view = await WebViewController.get();
        view.emit('atm:SetLocale', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_ATM));
    }

    static action(type: string, amount: number, id = null) {
        alt.emitServer(SYSTEM_EVENTS.INTERACTION_ATM_ACTION, type, amount, id);
    }

    static async change(key: string) {
        if (key !== 'bank' && key !== 'cash') {
            return;
        }

        const view = await WebViewController.get();
        view.emit('atm:Update', alt.Player.local.meta.bank, alt.Player.local.meta.cash);
    }
}

alt.onServer(SYSTEM_EVENTS.INTERACTION_ATM, AtmView.open);
alt.on(SYSTEM_EVENTS.META_CHANGED, AtmView.change);
