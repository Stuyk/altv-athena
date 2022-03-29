import * as alt from 'alt-client';
import { WebViewController } from '../../client/extensions/view2';
import ViewModel from '../../client/models/viewModel';
import PedEditCamera from '../../client/utility/camera';
import { isAnyMenuOpen } from '../../client/utility/menus';
import { Paintshop_View_Events } from '../../shared-plugins/core-paintshop/events';

interface RGB {
    r: number;
    g: number;
    b: number;
}

let areControlsEnabled = false;

// You should change this to match your Vue Template's ComponentName.
const PAGE_NAME = 'PaintShop';

class InternalFunctions implements ViewModel {
    static async open() {
        areControlsEnabled = false;

        // Check if any other menu is open before opening this.
        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        // This is where we bind our received events from the WebView to
        // the functions in our WebView.
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.on(`${PAGE_NAME}:Update`, InternalFunctions.update);
        view.on(`${PAGE_NAME}:Purchase`, InternalFunctions.purchase);
        view.on(`${PAGE_NAME}:ToggleControls`, () => {
            areControlsEnabled = !areControlsEnabled;
            alt.toggleGameControls(areControlsEnabled);
        });

        // This is where we open the page and show the cursor.
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        // Turn off game controls, hide the hud.
        alt.toggleGameControls(false);

        // Let the rest of the script know this menu is open.
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        // Turn off bound events.
        // If we do not turn them off we get duplicate event behavior.
        // Also will cause a memory leak if you do not turn them off.
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.off(`${PAGE_NAME}:Update`, InternalFunctions.update);
        view.off(`${PAGE_NAME}:Purchase`, InternalFunctions.purchase);

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
    }

    static async purchase(
        primary: RGB | number,
        secondary: RGB | number,
        isCustom = false,
        finish1: number,
        finish2: number,
        pearl: number,
    ) {
        InternalFunctions.update(primary, secondary, isCustom, finish1, finish2, pearl);
        alt.emitServer(Paintshop_View_Events.PURCHASE, primary, secondary);
        InternalFunctions.close();
    }

    static async update(
        primary: RGB | number,
        secondary: RGB | number,
        isCustom = false,
        finish1: number,
        finish2: number,
        pearl: number,
    ) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        let color1;
        let color2;

        if (primary) {
            if (isCustom) {
                color1 = primary as RGB;
            } else {
                color1 = primary as number;
            }
        }

        if (secondary) {
            if (isCustom) {
                color2 = secondary as RGB;
            } else {
                color2 = secondary as number;
            }
        }

        if (typeof color1 !== 'number' && typeof color2 === 'number') {
            color2 = color1;
        }

        if (!color2 && color1) {
            color2 = color1;
        }

        if (color1 && color2) {
            alt.emitServer(Paintshop_View_Events.PREVIEW_PAINT, color1, color2, finish1, finish2, pearl);
        }
    }
}

alt.onServer(Paintshop_View_Events.OPEN, InternalFunctions.open);
