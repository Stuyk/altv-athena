import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { BarbershopEvents } from '../shared/events';
import { BarbershopData } from '../shared/interfaces';

const Z_POS_ADD = 0.62;
const FOV = 16;
const PAGE_NAME = 'Barbershop';
let isSelfService = false;
let currentData: BarbershopData;
let camera: number;

class BarbershopView implements ViewModel {
    static async open(_isSelfService: boolean, _currentData: BarbershopData) {
        if (isAnyMenuOpen()) {
            return;
        }

        currentData = _currentData;
        isSelfService = _isSelfService;

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(BarbershopEvents.WebViewEvents.READY, BarbershopView.ready);
        view.on(BarbershopEvents.WebViewEvents.CLOSE, BarbershopView.close);
        view.on(BarbershopEvents.WebViewEvents.UPDATE, BarbershopView.update);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        BarbershopView.destroyCamera();

        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(BarbershopEvents.WebViewEvents.READY, BarbershopView.ready);
        view.off(BarbershopEvents.WebViewEvents.CLOSE, BarbershopView.close);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

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
        native.destroyAllCams(true);
        native.destroyCam(camera, true);
        camera = undefined;
    }

    static async ready() {
        const view = await WebViewController.get();
        if (!view) {
            return;
        }

        view.emit(BarbershopEvents.WebViewEvents.SET_DATA, currentData);
        BarbershopView.setupCamera();
    }

    static update(data: BarbershopData) {
        alt.emitServer(BarbershopEvents.ServerClientEvents.UPDATE, data);
        native.playSoundFrontend(-1, 'HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    }
}

alt.onServer(BarbershopEvents.ServerClientEvents.OPEN, BarbershopView.open);
alt.onServer(BarbershopEvents.ServerClientEvents.CLOSE, BarbershopView.close);
