import * as alt from 'alt-client';
import * as native from 'natives';
import { View } from '../extensions/view';
import PedEditCamera from '../utility/camera';
import { Appearance } from '../../shared/interfaces/Appearance';
import { View_Events_Creator } from '../../shared/enums/views';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { PedCharacter } from '../utility/characterPed';
import { Vector3 } from '../../shared/interfaces/Vector';
import { sleep } from '../utility/sleep';

const url = `http://assets/webview/client/creator/index.html`;
const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);
let view: View;
let oldCharacterData: Partial<Appearance> | null = {};
let readyInterval: number;
let noDiscard = true;
let noName = true;
let totalCharacters = 0;

native.requestModel(fModel);
native.requestModel(mModel);

export class CreatorView {
    static async open(
        pos: Vector3,
        heading: number,
        _oldCharacterData = null,
        _noDiscard = true,
        _noName = true,
        _totalCharacters = 0
    ) {
        oldCharacterData = _oldCharacterData;
        noDiscard = _noDiscard;
        noName = _noName;
        totalCharacters = _totalCharacters;

        await PedCharacter.destroy();
        await sleep(100);

        view = await View.getInstance(url, true);
        view.on('creator:ReadyDone', CreatorView.handleReadyDone);
        view.on('creator:Done', CreatorView.handleDone);
        view.on('creator:Cancel', CreatorView.handleCancel);
        view.on('creator:Sync', CreatorView.handleSync);
        view.on('creator:CheckName', CreatorView.handleCheckName);
        view.on('creator:DisableControls', CreatorView.handleDisableControls);

        await PedCharacter.create(true, pos, heading);
        await sleep(100);
        await PedEditCamera.create(PedCharacter.get(), { x: 0.18, y: -0.5, z: 0 });

        PedEditCamera.setFov(50);
        PedEditCamera.setZPos(0.6);
        readyInterval = alt.setInterval(CreatorView.waitForReady, 100);
    }

    static close() {
        if (!view) {
            return;
        }

        native.doScreenFadeOut(100);
        oldCharacterData = null;
        PedEditCamera.destroy();
        PedCharacter.destroy();
        view.close();
    }

    static handleDone(newData, infoData, name: string) {
        CreatorView.close();
        alt.emitServer(View_Events_Creator.Done, newData, infoData, name);
    }

    static handleCancel() {
        CreatorView.close();
        alt.emitServer(View_Events_Creator.Done, oldCharacterData);
    }

    static waitForReady() {
        view.emit('creator:Ready', noDiscard, noName);
    }

    static handleReadyDone() {
        if (readyInterval !== undefined || readyInterval !== null) {
            alt.clearInterval(readyInterval);
            readyInterval = null;
        }

        view.emit('creator:SetData', oldCharacterData, totalCharacters);
        view.emit('creator:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CREATOR));
    }

    static handleCheckName(name: string): void {
        alt.emitServer(View_Events_Creator.AwaitName, name);
    }

    static handleNameFinish(result: boolean): void {
        view.emit('creator:IsNameAvailable', result);
    }

    static handleDisableControls(shouldDisableControls: boolean): void {
        PedEditCamera.disableControls(shouldDisableControls);
    }

    static async handleSync(data: Appearance): Promise<void> {
        await PedCharacter.apply(data);
        PedEditCamera.update(PedCharacter.get());
    }
}

alt.onServer(View_Events_Creator.Sync, CreatorView.handleSync);
alt.onServer(View_Events_Creator.Show, CreatorView.open);
alt.onServer(View_Events_Creator.AwaitName, CreatorView.handleNameFinish);
