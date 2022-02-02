import * as alt from 'alt-client';
import * as native from 'natives';
import PedEditCamera from '../utility/camera';
import { Appearance } from '../../shared/interfaces/appearance';
import { View_Events_Creator } from '../../shared/enums/views';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { PedCharacter } from '../utility/characterPed';
import { Vector3 } from '../../shared/interfaces/vector';
import { sleep } from '../utility/sleep';
import { WebViewController } from '../extensions/view2';
import { disableAllControls } from '../utility/disableControls';
import { CharacterSystem } from '../systems/character';

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
        pos: Vector3,
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
        view.on('creator:ReadyDone', InternalFunctions.handleReadyDone);
        view.on('creator:Done', InternalFunctions.handleDone);
        view.on('creator:Cancel', InternalFunctions.handleCancel);
        view.on('creator:Sync', InternalFunctions.handleSync);
        view.on('creator:CheckName', InternalFunctions.handleCheckName);
        view.on('creator:DisableControls', InternalFunctions.handleDisableControls);
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
        alt.emitServer(View_Events_Creator.Done, newData, infoData, name);
    }

    static handleCancel() {
        InternalFunctions.close();
        alt.emitServer(View_Events_Creator.Done, oldCharacterData);
    }

    static async waitForReady() {
        const view = await WebViewController.get();
        view.emit('creator:Ready', noDiscard, noName);
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
        view.emit('creator:SetData', oldCharacterData, totalCharacters);
        view.emit('creator:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CREATOR));
    }

    static handleCheckName(name: string): void {
        alt.emitServer(View_Events_Creator.AwaitName, name);
    }

    static async handleNameFinish(result: boolean) {
        const view = await WebViewController.get();
        view.emit('creator:IsNameAvailable', result);
    }

    static handleDisableControls(shouldDisableControls: boolean): void {
        PedEditCamera.disableControls(shouldDisableControls);
    }

    static async handleSync(appearanceData: Appearance): Promise<void> {
        await PedCharacter.apply(appearanceData, true);
        PedEditCamera.update(PedCharacter.get());
    }
}

alt.onServer(View_Events_Creator.Sync, InternalFunctions.handleSync);
alt.onServer(View_Events_Creator.Show, InternalFunctions.open);
alt.onServer(View_Events_Creator.AwaitName, InternalFunctions.handleNameFinish);
