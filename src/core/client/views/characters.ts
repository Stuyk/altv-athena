import * as alt from 'alt-client';
import * as native from 'natives';
import { View_Events_Characters } from '../../shared/enums/views';
import { Character } from '../../shared/interfaces/character';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import PedEditCamera from '../utility/camera';
import { WebViewController } from '../extensions/view2';
import { Appearance } from '../../shared/interfaces/appearance';
import { sleep } from '../utility/sleep';
import { playPedAnimation } from '../systems/animations';
import { ANIMATION_FLAGS } from '../../shared/flags/animationFlags';
import { Item } from '../../shared/interfaces/item';
import { PedCharacter } from '../utility/characterPed';
import { Vector3 } from '../../shared/interfaces/vector';
import { CharacterSystem } from '../systems/character';
import { disableAllControls } from '../utility/disableControls';
import ViewModel from '../models/viewModel';

const PAGE_NAME = 'CharacterSelect';
const IDLE_ANIM_DICT = 'anim@amb@business@bgen@bgen_no_work@';
const IDLE_ANIM = 'stand_phone_phoneputdown_idle_nowork';
let characters: Partial<Character>[];
let isOpen = false;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async open(_characters: Partial<Character>[], pos: Vector3, heading: number) {
        characters = _characters;
        const view = await WebViewController.get();

        if (isOpen) {
            view.emit(`${PAGE_NAME}:Set`, characters);
            return;
        }

        view.on(`${PAGE_NAME}:Select`, InternalFunctions.select);
        view.on(`${PAGE_NAME}:New`, InternalFunctions.handleNew);
        view.on(`${PAGE_NAME}:Update`, InternalFunctions.update); // Calls `creator.ts`
        view.on(`${PAGE_NAME}:Delete`, InternalFunctions.handleDelete);
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        await PedCharacter.create(_characters[0].appearance.sex === 1 ? true : false, pos, heading);
        await PedCharacter.apply(_characters[0].appearance as Appearance);
        await sleep(300);
        await PedEditCamera.create(PedCharacter.get(), { x: -0.25, y: 0, z: 0 });
        await PedEditCamera.setCamParams(0.5, 40, 100);

        InternalFunctions.update(0);

        await sleep(2000);
        native.doScreenFadeIn(500);

        isOpen = true;
    }

    static async update(index: number) {
        await sleep(100);

        await PedCharacter.apply(characters[index].appearance as Appearance);
        PedEditCamera.update(PedCharacter.get());
        await sleep(100);

        CharacterSystem.applyEquipment(PedCharacter.get(), characters[index].equipment as Array<Item>);

        await new Promise((resolve: Function) => {
            let count = 0;

            const interval = alt.setInterval(() => {
                if (!PedCharacter.get()) {
                    return;
                }

                if (!native.doesEntityExist(PedCharacter.get())) {
                    return;
                }

                playPedAnimation(
                    PedCharacter.get(),
                    IDLE_ANIM_DICT,
                    IDLE_ANIM,
                    ANIMATION_FLAGS.NORMAL | ANIMATION_FLAGS.REPEAT,
                );

                const isInAnim = native.isEntityPlayingAnim(PedCharacter.get(), IDLE_ANIM_DICT, IDLE_ANIM, 3);

                count += 1;

                if (count >= 25) {
                    alt.clearInterval(interval);
                    resolve();
                }

                if (!isInAnim) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
            }, 100);
        });

        await sleep(100);
        native.doScreenFadeIn(100);
    }

    static async close() {
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Select`, InternalFunctions.select);
        view.off(`${PAGE_NAME}:New`, InternalFunctions.handleNew);
        view.off(`${PAGE_NAME}:Update`, InternalFunctions.update); // Calls `creator.ts`
        view.off(`${PAGE_NAME}:Delete`, InternalFunctions.handleDelete);
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        await PedEditCamera.destroy();
        await PedCharacter.destroy();

        native.switchInPlayer(1500);
        native.freezeEntityPosition(alt.Player.local.scriptID, false);

        alt.toggleGameControls(true);
        disableAllControls(false);

        isOpen = false;
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CHARACTERS));
        view.emit(`${PAGE_NAME}:Set`, characters);
    }

    static async select(id) {
        PedCharacter.setHidden(true);
        alt.emitServer(View_Events_Characters.Select, id);
    }

    static async handleNew() {
        alt.emitServer(View_Events_Characters.New);
    }

    static async handleDelete(id) {
        alt.emitServer(View_Events_Characters.Delete, id);
    }
}

alt.onServer(View_Events_Characters.Show, InternalFunctions.open);
alt.onServer(View_Events_Characters.Done, InternalFunctions.close);
