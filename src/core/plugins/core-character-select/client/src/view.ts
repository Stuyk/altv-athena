import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../../client/extensions/view2';
import ViewModel from '../../../../client/models/viewModel';
import { playPedAnimation } from '../../../../client/systems/animations';
import { CharacterSystem } from '../../../../client/systems/character';
import PedEditCamera from '../../../../client/utility/camera';
import { PedCharacter } from '../../../../client/utility/characterPed';
import { disableAllControls } from '../../../../client/utility/disableControls';
import { sleep } from '../../../../client/utility/sleep';
import { ANIMATION_FLAGS } from '../../../../shared/flags/animationFlags';
import { Appearance } from '../../../../shared/interfaces/appearance';
import { Character } from '../../../../shared/interfaces/character';
import { Item } from '../../../../shared/interfaces/item';
import { CHARACTER_SELECT_CONFIG } from '../../shared/config';
import { CHARACTER_SELECT_EVENTS, CHARACTER_SELECT_WEBVIEW_EVENTS } from '../../shared/events';

const PAGE_NAME = 'CharacterSelect';
const IDLE_ANIM_DICT = 'anim@amb@business@bgen@bgen_no_work@';
const IDLE_ANIM = 'stand_phone_phoneputdown_idle_nowork';
let characters: Partial<Character>[];
let isOpen = false;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async open(_characters: Partial<Character>[]) {
        characters = _characters;
        const view = await WebViewController.get();

        if (isOpen) {
            view.emit(CHARACTER_SELECT_WEBVIEW_EVENTS.SET_CHARACTERS, characters);
            return;
        }

        view.on(CHARACTER_SELECT_WEBVIEW_EVENTS.SELECT, InternalFunctions.select);
        view.on(CHARACTER_SELECT_WEBVIEW_EVENTS.NEW, InternalFunctions.handleNew);
        view.on(CHARACTER_SELECT_WEBVIEW_EVENTS.UPDATE, InternalFunctions.update); // Calls `creator.ts`
        view.on(CHARACTER_SELECT_WEBVIEW_EVENTS.DELETE, InternalFunctions.handleDelete);
        view.on(CHARACTER_SELECT_WEBVIEW_EVENTS.READY, InternalFunctions.ready);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        await PedCharacter.create(
            _characters[0].appearance.sex === 1 ? true : false,
            CHARACTER_SELECT_CONFIG.CHARACTER_SELECT_POS,
            CHARACTER_SELECT_CONFIG.CHARACTER_SELECT_ROT,
        );

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
        view.off(CHARACTER_SELECT_WEBVIEW_EVENTS.SELECT, InternalFunctions.select);
        view.off(CHARACTER_SELECT_WEBVIEW_EVENTS.NEW, InternalFunctions.handleNew);
        view.off(CHARACTER_SELECT_WEBVIEW_EVENTS.UPDATE, InternalFunctions.update); // Calls `creator.ts`
        view.off(CHARACTER_SELECT_WEBVIEW_EVENTS.DELETE, InternalFunctions.handleDelete);
        view.off(CHARACTER_SELECT_WEBVIEW_EVENTS.READY, InternalFunctions.ready);

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
        view.emit(CHARACTER_SELECT_WEBVIEW_EVENTS.SET_CHARACTERS, characters);
    }

    static async select(id) {
        PedCharacter.setHidden(true);

        alt.emitServer(CHARACTER_SELECT_EVENTS.SELECT, id);
    }

    static async handleNew() {
        alt.emitServer(CHARACTER_SELECT_EVENTS.NEW);
    }

    static async handleDelete(id) {
        alt.emitServer(CHARACTER_SELECT_EVENTS.DELETE, id);
    }
}

alt.onServer(CHARACTER_SELECT_EVENTS.SHOW, InternalFunctions.open);
alt.onServer(CHARACTER_SELECT_EVENTS.DONE, InternalFunctions.close);
