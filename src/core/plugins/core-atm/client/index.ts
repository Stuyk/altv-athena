import * as alt from 'alt-client';
import { ClientAPI } from '../../../client';
import { SharedAPI } from '../../../shared';
import { ATM_INTERACTIONS } from '../shared/events';
import { LOCALE_ATM_VIEW } from '../shared/locales';

const PAGE_NAME = 'Atm';

class AtmView implements ClientAPI.models.ViewModel {
    static async open() {
        if (ClientAPI.utility.isAnyMenuOpen()) {
            return;
        }

        const view = await ClientAPI.extensions.WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, AtmView.ready);
        view.on(`${PAGE_NAME}:Close`, AtmView.close);
        view.on(`${PAGE_NAME}:Action`, AtmView.action);
        ClientAPI.extensions.WebViewController.openPages(PAGE_NAME, true, AtmView.close);
        ClientAPI.extensions.WebViewController.focus();
        ClientAPI.extensions.WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        ClientAPI.extensions.WebViewController.setOverlaysVisible(true);

        const view = await ClientAPI.extensions.WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, AtmView.ready);
        view.off(`${PAGE_NAME}:Close`, AtmView.close);
        view.off(`${PAGE_NAME}:Action`, AtmView.action);

        ClientAPI.extensions.WebViewController.closePages([PAGE_NAME]);
        ClientAPI.extensions.WebViewController.unfocus();
        ClientAPI.extensions.WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        AtmView.change('bank');
        const view = await ClientAPI.extensions.WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LOCALE_ATM_VIEW);
    }

    static action(type: string, amount: number, id = null) {
        alt.emitServer(ATM_INTERACTIONS.ACTION, type, amount, id);
    }

    static async change(key: string) {
        if (key !== 'bank' && key !== 'cash' && key !== 'bankNumber') {
            return;
        }

        const view = await ClientAPI.extensions.WebViewController.get();
        view.emit(
            `${PAGE_NAME}:Update`,
            alt.Player.local.meta.bank,
            alt.Player.local.meta.cash,
            alt.Player.local.meta.bankNumber,
        );
    }
}

alt.onServer(ATM_INTERACTIONS.OPEN, AtmView.open);
alt.on(SharedAPI.enums.SYSTEM_EVENTS.META_CHANGED, AtmView.change);
