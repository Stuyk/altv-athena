import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../../client/extensions/view2';
import { CharacterSystem } from '../../../../client/systems/character';
import PedEditCamera from '../../../../client/utility/camera';
import { PedCharacter } from '../../../../client/utility/characterPed';
import { disableAllControls } from '../../../../client/utility/disableControls';
import { sleep } from '../../../../client/utility/sleep';
import { Appearance } from '../../../../shared/interfaces/appearance';
import { CHARACTER_CREATOR_EVENTS, CHARACTER_CREATOR_WEBVIEW_EVENTS } from '../../shared/events';

const PAGE_NAME = 'CharacterCreator';
const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);
let oldCharacterData: Partial<Appearance> | null = {};
let readyInterval: number;
let noDiscard = true;
let noName = true;
let totalCharacters = 0;

native.requestModel(fModel);
native.requestModel(mModel);

/**
 * Do Not Export Internal Only
 */
class InternalFunctions {
    static async open(
        pos: alt.Vector3,
        heading: number,
        _oldCharacterData = null,
        _noDiscard = true,
        _noName = true,
        _totalCharacters = 0,
    ) {
        oldCharacterData = _oldCharacterData;
        noDiscard = _noDiscard;
        noName = _noName;
        totalCharacters = _totalCharacters;

        await PedCharacter.destroy();
        await sleep(100);

        const view = await WebViewController.get();
        view.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY_SETUP_COMPLETE, InternalFunctions.handleReadyDone);
        view.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.DONE, InternalFunctions.handleDone);
        view.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.SYNC, InternalFunctions.handleSync);
        view.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.VERIFY_NAME, InternalFunctions.handleCheckName);
        view.on(CHARACTER_CREATOR_WEBVIEW_EVENTS.DISABLE_CONTROLS, InternalFunctions.handleDisableControls);
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        await PedCharacter.create(true, pos, heading);
        await sleep(100);
        await PedCharacter.setHidden(true);
        await PedEditCamera.create(PedCharacter.get(), { x: -0.25, y: 0, z: 0 });
        await PedEditCamera.setCamParams(0.6, 50);
        await CharacterSystem.applyEquipment(PedCharacter.get(), null, true);
        readyInterval = alt.setInterval(InternalFunctions.waitForReady, 100);
    }

    static close() {
        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);
        PedEditCamera.destroy();
        PedCharacter.destroy();
        native.doScreenFadeOut(100);
        oldCharacterData = null;

        alt.toggleGameControls(true);
        disableAllControls(false);
    }

    static handleDone(newData, infoData, name: string) {
        InternalFunctions.close();
        alt.emitServer(CHARACTER_CREATOR_EVENTS.DONE, newData, infoData, name);
    }

    static async waitForReady() {
        const view = await WebViewController.get();
        view.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.READY, noDiscard, noName);
    }

    static async handleReadyDone() {
        if (readyInterval !== undefined || readyInterval !== null) {
            alt.clearInterval(readyInterval);
            readyInterval = null;
        }

        if (native.isScreenFadedOut() || native.isScreenFadingOut()) {
            native.doScreenFadeIn(1000);
        }

        await PedCharacter.setHidden(false);

        const view = await WebViewController.get();
        view.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.SET_DATA, oldCharacterData, totalCharacters);
    }

    static handleCheckName(name: string): void {
        alt.emitServer(CHARACTER_CREATOR_EVENTS.VERIFY_NAME, name);
    }

    static async handleNameFinish(result: boolean) {
        const view = await WebViewController.get();
        view.emit(CHARACTER_CREATOR_WEBVIEW_EVENTS.VERIFY_NAME, result);
    }

    static handleDisableControls(shouldDisableControls: boolean): void {
        PedEditCamera.disableControls(shouldDisableControls);
    }

    static async handleSync(_appearance: Appearance): Promise<void> {
        await PedCharacter.apply(_appearance, true);
        PedEditCamera.update(PedCharacter.get());
    }
}

// Needs to be moved server side... yay nightmares
// alt.onServer(View_Events_Creator.Sync, InternalFunctions.handleSync);
alt.onServer(CHARACTER_CREATOR_EVENTS.SHOW, InternalFunctions.open);
alt.onServer(CHARACTER_CREATOR_EVENTS.VERIFY_NAME, InternalFunctions.handleNameFinish);
