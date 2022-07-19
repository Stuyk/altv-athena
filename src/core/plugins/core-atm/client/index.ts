import * as alt from 'alt-client';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { ATM_INTERACTIONS } from '../shared/events';
import { LOCALE_ATM_VIEW } from '../shared/locales';

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
        WebViewController.openPages(PAGE_NAME, true, AtmView.close);
        WebViewController.focus();
        WebViewController.showCursor(true);

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
        view.emit(`${PAGE_NAME}:SetLocale`, LOCALE_ATM_VIEW);
    }

    static action(type: string, amount: number, id = null) {
        alt.emitServer(ATM_INTERACTIONS.ACTION, type, amount, id);
    }

    static async change(key: string) {
        if (key !== 'bank' && key !== 'cash' && key !== 'bankNumber') {
            return;
        }

        const view = await WebViewController.get();
        view.emit(
            `${PAGE_NAME}:Update`,
            alt.Player.local.meta.bank,
            alt.Player.local.meta.cash,
            alt.Player.local.meta.bankNumber,
        );
    }
}

alt.onServer(ATM_INTERACTIONS.OPEN, AtmView.open);
alt.on(SYSTEM_EVENTS.META_CHANGED, AtmView.change);
