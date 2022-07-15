import * as alt from 'alt-client';
import * as native from 'natives';
import { AthenaClient } from '../../../client/api/athena';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
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

        AthenaClient.webview.ready(PAGE_NAME, BarbershopView.ready);
        AthenaClient.webview.open([PAGE_NAME], true, BarbershopView.close);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        BarbershopView.destroyCamera();

        alt.toggleGameControls(true);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        alt.emitServer(BarbershopEvents.ServerClientEvents.CLOSE);
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
        native.renderScriptCams(false, false, 0, false, false, 0);
        camera = undefined;
    }

    static async ready() {
        const view = await WebViewController.get();
        if (!view) {
            return;
        }

        AthenaClient.webview.emit(BarbershopEvents.WebViewEvents.SET_DATA, currentData);
        BarbershopView.setupCamera();
    }

    static update(data: BarbershopData) {
        alt.emitServer(BarbershopEvents.ServerClientEvents.UPDATE, data);
        native.playSoundFrontend(-1, 'HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    }
}

alt.onServer(BarbershopEvents.ServerClientEvents.OPEN, BarbershopView.open);
alt.onServer(BarbershopEvents.ServerClientEvents.CLOSE, BarbershopView.close);
