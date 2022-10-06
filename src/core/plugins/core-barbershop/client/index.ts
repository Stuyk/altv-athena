import * as alt from 'alt-client';
import * as native from 'natives';
import { ClientAPI } from '../../../client';
import { BarbershopEvents } from '../shared/events';
import { BarbershopData } from '../shared/interfaces';

const Z_POS_ADD = 0.62;
const FOV = 16;
const PAGE_NAME = 'Barbershop';
let isSelfService = false;
let currentData: BarbershopData;
let camera: number;
let hasRegisteredOnce = false;

class BarbershopView implements ClientAPI.models.ViewModel {
    /**
     * Opens the BarberShop WebView and sets up current data for the player.
     *
     * @static
     * @param {boolean} _isSelfService
     * @param {BarbershopData} _currentData
     * @return {*}
     * @memberof BarbershopView
     */
    static async open(_isSelfService: boolean, _currentData: BarbershopData) {
        if (ClientAPI.utility.isAnyMenuOpen()) {
            return;
        }

        currentData = _currentData;
        isSelfService = _isSelfService;

        ClientAPI.athena.webview.ready(PAGE_NAME, BarbershopView.ready);
        ClientAPI.athena.webview.open([PAGE_NAME], true, BarbershopView.close);

        if (!hasRegisteredOnce) {
            hasRegisteredOnce = true;
            ClientAPI.athena.webview.on(BarbershopEvents.WebViewEvents.UPDATE, BarbershopView.update);
            ClientAPI.athena.webview.on(BarbershopEvents.WebViewEvents.SAVE_CLOSE, BarbershopView.saveClose);
        }

        ClientAPI.extensions.WebViewController.focus();
        ClientAPI.extensions.WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    /**
     * Closes the WebView page. Called from internal webview close event.
     * Can also be called from server-side; but doNotEmit is usually set to true.
     *
     * @static
     * @param {boolean} [doNotEmit=false]
     * @return {*}
     * @memberof BarbershopView
     */
    static async close(doNotEmit = false) {
        BarbershopView.destroyCamera();

        alt.toggleGameControls(true);
        ClientAPI.extensions.WebViewController.unfocus();
        ClientAPI.extensions.WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        if (doNotEmit) {
            return;
        }

        alt.emitServer(BarbershopEvents.ServerClientEvents.CLOSE);
    }

    /**
     * Simply closes the WebView, and ensures that an emit to server does not happen for close event.
     *
     * @static
     * @memberof BarbershopView
     */
    static saveClose() {
        BarbershopView.close(true);
        ClientAPI.extensions.WebViewController.closePages([PAGE_NAME], true);
    }

    /**
     * It creates a camera, sets it active, renders it, points it at the player, and makes the player
     * look at the camera.
     */
    static setupCamera() {
        const fwdVector = native.getEntityForwardVector(alt.Player.local.scriptID);
        const fwdPos = {
            x: alt.Player.local.pos.x + fwdVector.x * 2,
            y: alt.Player.local.pos.y + fwdVector.y * 2,
            z: alt.Player.local.pos.z + Z_POS_ADD,
        };

        camera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            fwdPos.x,
            fwdPos.y,
            fwdPos.z,
            0,
            0,
            0,
            FOV,
            true,
            0,
        );
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, 0);
        native.pointCamAtCoord(
            camera,
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z + Z_POS_ADD,
        );

        native.taskLookAtCoord(alt.Player.local.scriptID, fwdPos.x, fwdPos.y, fwdPos.z, -1, 0, 2);
    }

    static destroyCamera() {
        try {
            native.destroyAllCams(true);
            native.destroyCam(camera, true);
            native.renderScriptCams(false, false, 0, false, false, 0);
        } catch (err) {}

        camera = undefined;
    }

    /**
     * If the webview is ready, emit the data to the webview and setup the camera.
     */
    static async ready() {
        const view = await ClientAPI.extensions.WebViewController.get();
        if (!view) {
            return;
        }

        ClientAPI.athena.webview.emit(BarbershopEvents.WebViewEvents.SET_DATA, currentData);
        BarbershopView.setupCamera();
    }

    /**
     * This function is called when the player clicks on a button in the barbershop menu, and it sends
     * the data to the server.
     * @param {BarbershopData} data - BarbershopData
     */
    static update(data: BarbershopData) {
        alt.emitServer(BarbershopEvents.ServerClientEvents.UPDATE, data);
        native.playSoundFrontend(-1, 'HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    }
}

alt.onServer(BarbershopEvents.ServerClientEvents.OPEN, BarbershopView.open);
alt.onServer(BarbershopEvents.ServerClientEvents.CLOSE, BarbershopView.close);
