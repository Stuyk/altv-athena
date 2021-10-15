import * as alt from 'alt-client';
import * as native from 'natives';
import { View_Events_Characters } from '../../shared/enums/views';
import { Character } from '../../shared/interfaces/Character';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import PedEditCamera from '../utility/camera';
import { WebViewController } from '../extensions/view2';
import { Appearance } from '../../shared/interfaces/Appearance';
import { sleep } from '../utility/sleep';
import { playPedAnimation } from '../systems/animations';
import { ANIMATION_FLAGS } from '../../shared/flags/AnimationFlags';
import { Item } from '../../shared/interfaces/Item';
import { PedCharacter } from '../utility/characterPed';
import { Vector3 } from '../../shared/interfaces/Vector';
import { CharacterSystem } from '../systems/character';

const PAGE_NAME = 'CharacterSelect';
const IDLE_ANIM_DICT = 'anim@amb@business@bgen@bgen_no_work@';
const IDLE_ANIM = 'stand_phone_phoneputdown_idle_nowork';
let characters: Partial<Character>[];

alt.onServer(View_Events_Characters.Show, handleView);
alt.onServer(View_Events_Characters.Done, handleDone);

async function handleView(_characters: Partial<Character>[], pos: Vector3, heading: number) {
    characters = _characters;

    const view = await WebViewController.get();
    view.on('characters:Select', handleSelect);
    view.on('characters:New', handleNew);
    view.on('characters:Update', updateCharacter); // Calls `creator.ts`
    view.on('characters:Delete', handleDelete);
    view.on('characters:Ready', handleReady);
    WebViewController.openPages([PAGE_NAME]);
    WebViewController.focus();
    WebViewController.showCursor(true);

    native.doScreenFadeOut(100);
    await PedCharacter.create(_characters[0].appearance.sex === 1 ? true : false, pos, heading);
    await PedCharacter.apply(_characters[0].appearance as Appearance);
    await sleep(300);
    await PedEditCamera.create(PedCharacter.get(), { x: -0.25, y: 0, z: 0 });
    PedEditCamera.setFov(40);
    PedEditCamera.setZPos(0.5);

    updateCharacter(0);
}

async function updateCharacter(index: number) {
    native.doScreenFadeOut(100);
    await sleep(100);

    await PedCharacter.apply(characters[index].appearance as Appearance);
    PedEditCamera.update(PedCharacter.get());
    await sleep(100);

    CharacterSystem.applyEquipment(PedCharacter.get(), characters[index].equipment as Array<Item>);

    await new Promise((resolve: Function) => {
        let count = 0;

        const interval = alt.setInterval(() => {
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

async function handleReady() {
    const view = await WebViewController.get();
    view.emit('characters:SetLocale', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CHARACTERS));
    view.emit('characters:Set', characters);
}

async function handleSelect(id) {
    native.doScreenFadeOut(100);
    alt.emitServer(View_Events_Characters.Select, id);
}

function handleNew() {
    alt.emitServer(View_Events_Characters.New);
}

function handleDelete(id) {
    alt.emitServer(View_Events_Characters.Delete, id);
}

function handleDone() {
    WebViewController.closePages([PAGE_NAME]);
    WebViewController.unfocus();
    WebViewController.showCursor(false);
    PedEditCamera.destroy();
    PedCharacter.destroy();
    native.switchInPlayer(1500);
}
