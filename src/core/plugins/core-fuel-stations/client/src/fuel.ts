import * as alt from 'alt-client';
import { VIEW_EVENTS_FUEL_TRIGGER } from '../../shared/events';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { JobTrigger } from '../../../../shared/interfaces/jobTrigger';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { WebViewController } from '../../../../client/extensions/view2';
import ViewModel from '../../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../../client/utility/menus';

const PAGE_NAME = 'Fuel';
let trigger: JobTrigger;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static init() {
        alt.onServer(VIEW_EVENTS_FUEL_TRIGGER.OPEN, InternalFunctions.open);
    }

    static async open(_trigger: JobTrigger) {
        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        trigger = _trigger;

        // This is where we bind our received events from the WebView to
        // the functions in our WebView.
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Select`, InternalFunctions.accept);

        // This is where we open the page and show the cursor.
        WebViewController.openPages(PAGE_NAME, true, InternalFunctions.close);
        WebViewController.focus();
        WebViewController.showCursor(true);

        // Turn off game controls, hide the hud.
        alt.toggleGameControls(false);

        // Let the rest of the script know this menu is open.
        alt.Player.local.isMenuOpen = true;
    }

    static accept(amount: number) {
        alt.emitServer(VIEW_EVENTS_FUEL_TRIGGER.ACCEPT, amount);

        alt.toggleGameControls(true);
        InternalFunctions.close(true, true);
    }

    static async close(doNotCancel = false, shouldClosePage = false) {
        alt.toggleGameControls(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Select`, InternalFunctions.accept);

        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        if (shouldClosePage) {
            WebViewController.closePages([PAGE_NAME], true);
        }

        if (doNotCancel) {
            return;
        }

        alt.emitServer(VIEW_EVENTS_FUEL_TRIGGER.CANCEL);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Data`, trigger);
        view.emit(`${PAGE_NAME}:SetLocales`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_JOB));
    }
}

InternalFunctions.init();
