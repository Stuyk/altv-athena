import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';

const PAGE_NAME = 'Atm';

class AtmView implements ViewModel {
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, AtmView.ready);
        view.on(`${PAGE_NAME}:Close`, AtmView.close);
        view.on(`${PAGE_NAME}:Action`, AtmView.action);
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        WebViewController.setOverlaysVisible(false);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, AtmView.ready);
        view.off(`${PAGE_NAME}:Close`, AtmView.close);
        view.off(`${PAGE_NAME}:Action`, AtmView.action);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        AtmView.change('bank');
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_ATM));
    }

    static action(type: string, amount: number, id = null) {
        alt.emitServer(SYSTEM_EVENTS.INTERACTION_ATM_ACTION, type, amount, id);
    }

    static async change(key: string) {
        if (key !== 'bank' && key !== 'cash') {
            return;
        }

        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Update`, alt.Player.local.meta.bank, alt.Player.local.meta.cash);
    }
}

alt.onServer(SYSTEM_EVENTS.INTERACTION_ATM, AtmView.open);
alt.on(SYSTEM_EVENTS.META_CHANGED, AtmView.change);
