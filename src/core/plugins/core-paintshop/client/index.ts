import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { CinematicCam } from '../../../client/utility/cinematic';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { Vector3 } from '../../../shared/interfaces/vector';
import { Paintshop_View_Events } from '../shared/events';
import { iPaintshopSync } from '../shared/interfaces';

interface RGB {
    r: number;
    g: number;
    b: number;
}

let syncData: iPaintshopSync;

// You should change this to match your Vue Template's ComponentName.
const PAGE_NAME = 'PaintShop';

class InternalFunctions implements ViewModel {
    static async open(_syncData: iPaintshopSync) {
        // Check if any other menu is open before opening this.
        if (isAnyMenuOpen()) {
            return;
        }

        // Data to sync in the interface
        syncData = _syncData;

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        // This is where we bind our received events from the WebView to
        // the functions in our WebView.
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.on(`${PAGE_NAME}:Update`, InternalFunctions.update);
        view.on(`${PAGE_NAME}:Purchase`, InternalFunctions.purchase);
        view.on(`${PAGE_NAME}:NextCam`, () => {
            CinematicCam.next(false);
        });

        // This is where we open the page and show the cursor.
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        // Turn off game controls, hide the hud.
        alt.toggleGameControls(false);

        // Let the rest of the script know this menu is open.
        alt.Player.local.isMenuOpen = true;

        const points = InternalFunctions.generateCameraPoints();

        // Clear Cinematic Camera
        CinematicCam.destroy();

        // Add Camera Ponts to Cinematic Cam List
        for (let i = 0; i < points.length; i++) {
            CinematicCam.addNode({
                pos: points[i],
                fov: 90,
                easeTime: 250,
                positionToTrack: alt.Player.local.vehicle.pos,
            });
        }

        CinematicCam.next(false);
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

        alt.emitServer(Paintshop_View_Events.CLOSE);

        CinematicCam.destroy();
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
        view.emit(`${PAGE_NAME}:Ready`, syncData);
    }

    static async purchase(
        color1: RGB | number,
        color2: RGB | number,
        isCustom = false,
        finish1: number,
        finish2: number,
        pearl: number,
    ) {
        InternalFunctions.update(color1, color2, isCustom, finish1, finish2, pearl);
        alt.emitServer(Paintshop_View_Events.PURCHASE, color1, color2, finish1, finish2, pearl);
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

    static generateCameraPoints(): Array<Vector3> {
        const cameraPoints = [];
        const zPos = alt.Player.local.pos.z;

        const [_, min, max] = native.getModelDimensions(alt.Player.local.vehicle.model);
        const offsetCalculations = [];
        const additional = 0.5;

        // Top Left
        offsetCalculations.push({
            x: min.x - additional,
            y: max.y + additional,
            z: zPos,
        });

        // Top Middle
        offsetCalculations.push({
            x: 0,
            y: max.y + additional,
            z: zPos,
        });

        // Top Right
        offsetCalculations.push({
            x: max.x + additional,
            y: max.y + additional,
            z: zPos,
        });

        // Middle Right
        offsetCalculations.push({
            x: max.x + additional,
            y: 0,
            z: zPos,
        });

        // Back Right
        offsetCalculations.push({
            x: max.x + additional,
            y: min.y - additional,
            z: zPos,
        });

        // Middle Center
        offsetCalculations.push({
            x: 0,
            y: min.y - additional,
            z: zPos,
        });

        // Bottom Left
        offsetCalculations.push({
            x: min.x - additional,
            y: min.y - additional,
            z: zPos,
        });

        // Middle Left
        offsetCalculations.push({
            x: min.x - additional,
            y: 0,
            z: zPos,
        });

        for (let i = 0; i < offsetCalculations.length; i++) {
            const calc = native.getOffsetFromEntityInWorldCoords(
                alt.Player.local.vehicle.scriptID,
                offsetCalculations[i].x,
                offsetCalculations[i].y,
                1,
            );

            cameraPoints.push(calc);
        }

        return cameraPoints;
    }
}

alt.onServer(Paintshop_View_Events.OPEN, InternalFunctions.open);
