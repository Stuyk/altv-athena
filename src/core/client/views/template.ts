import * as alt from 'alt-client';

import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

// You should change this to match your Vue Template's ComponentName.
const PAGE_NAME = 'Template';

class TemplateView implements ViewModel {
    static async open() {
        // Check if any other menu is open before opening this.
        if (isAnyMenuOpen()) {
            return;
        }

        // This is where we bind our received events from the WebView to
        // the functions in our WebView.
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, TemplateView.ready);
        view.on(`${PAGE_NAME}:Close`, TemplateView.close);

        // This is where we open the page and show the cursor.
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        // Turn off game controls, hide the hud.
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);

        // Let the rest of the script know this menu is open.
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);

        // Turn off bound events.
        // If we do not turn them off we get duplicate event behavior.
        // Also will cause a memory leak if you do not turn them off.
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, TemplateView.ready);
        view.off(`${PAGE_NAME}:Close`, TemplateView.close);

        // Close the page.
        WebViewController.closePages([PAGE_NAME]);

        // Turn on game controls, show the hud.
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        // Let the rest of the script know this menu is closed.
        alt.Player.local.isMenuOpen = false;
    }

    /**
     * You should call this from the WebView.
     * What this will let you do is define local data in the client.
     *
     * Then when the WebView is ready to receieve that data we can send it.
     * The flow is:
     *
     * Send From WebView -> Get the Data Here -> Send to the WebView
     *
     * @static
     * @memberof TemplateView
     */
    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SendSomeData`, 'hello world');
    }
}
