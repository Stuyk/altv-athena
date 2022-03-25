import * as alt from 'alt-client';
import * as natives from 'natives';
import { View_Events_PaintShop } from '../../shared/enums/views';

import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';
import { isAnyMenuOpen } from '../utility/menus';

interface RGB {
    r: number;
    g: number;
    b: number;
}

let primaryColor: RGB = null;
let secondaryColor: RGB = null;

// You should change this to match your Vue Template's ComponentName.
const PAGE_NAME = 'PaintShop';

class InternalFunctions implements ViewModel {
    static async open() {
        // Check if any other menu is open before opening this.
        if (isAnyMenuOpen()) {
            return;
        }

        primaryColor = null;
        secondaryColor = null;

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        // This is where we bind our received events from the WebView to
        // the functions in our WebView.
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.on(`${PAGE_NAME}:Update`, InternalFunctions.update);
        view.on(`${PAGE_NAME}:Purchase`, InternalFunctions.purchase);

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

    static async purchase(primary: RGB, secondary: RGB) {
        if (primaryColor) {
            natives.setVehicleCustomPrimaryColour(
                alt.Player.local.vehicle.scriptID,
                primaryColor.r,
                primaryColor.g,
                primaryColor.b,
            );
        }

        if (secondaryColor) {
            natives.setVehicleCustomSecondaryColour(
                alt.Player.local.vehicle.scriptID,
                secondaryColor.r,
                secondaryColor.g,
                secondaryColor.b,
            );
        }

        alt.emitServer(View_Events_PaintShop.Purchase, primary, secondary);
        InternalFunctions.close();
    }

    static async update(primary: RGB, secondary: RGB) {
        if (!alt.Player.local.vehicle) {
            return;
        }

        if (!primaryColor) {
            const [_a, r, g, b] = natives.getVehicleCustomPrimaryColour(alt.Player.local.vehicle.scriptID);
            primaryColor = {
                r,
                g,
                b,
            };
        }

        if (!secondaryColor) {
            const [_a, r, g, b] = natives.getVehicleCustomSecondaryColour(alt.Player.local.vehicle.scriptID);
            secondaryColor = {
                r,
                g,
                b,
            };
        }

        natives.setVehicleCustomPrimaryColour(alt.Player.local.vehicle.scriptID, primary.r, primary.g, primary.b);
        natives.setVehicleCustomSecondaryColour(
            alt.Player.local.vehicle.scriptID,
            secondary.r,
            secondary.g,
            secondary.b,
        );
    }
}

alt.onServer(View_Events_PaintShop.Open, InternalFunctions.open);
