import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { KEY_BINDS } from '@AthenaShared/enums/keyBinds.js';
import { playAnimation } from '@AthenaClient/systems/animations.js';
import commonAnims from './animationMenus/commonAnims.js';
import danceAnims from './animationMenus/danceAnims.js';
import emoteAnims from './animationMenus/emoteAnims.js';
import funAnims from './animationMenus/funAnims.js';
import idleAnims from './animationMenus/idleAnims.js';
import leanAnims from './animationMenus/leanAnims.js';
import waitAnims from './animationMenus/waitAnims.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';

function callback(dict: string, name: string, flags: number) {
    console.log(dict, name, flags);

    if (alt.Player.local.vehicle) {
        return;
    }

    playAnimation(dict, name, flags);
}

function handleAnimationMenu() {
    if (alt.Player.local.vehicle) {
        return;
    }

    if (AthenaClient.webview.isAnyMenuOpen()) {
        return;
    }

    AthenaClient.systems.wheelMenu.open(
        'Animations',
        [
            {
                name: 'Clear',
                callback: () => {
                    if (alt.Player.local.vehicle) {
                        return;
                    }

                    native.clearPedTasks(alt.Player.local.scriptID);
                },
                icon: 'icon-clear',
            },
            {
                name: 'Dance',
                callback: () => {
                    AthenaClient.systems.wheelMenu.update('Dance', danceAnims(callback), true);
                },
                doNotClose: true,
                icon: 'icon-directions_run',
            },
            {
                name: 'Idle',
                callback: () => {
                    AthenaClient.systems.wheelMenu.update('Idle', idleAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-timer',
            },
            {
                name: 'Fun',
                callback: () => {
                    AthenaClient.systems.wheelMenu.update('Fun', funAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-celebration',
            },
            {
                name: 'Wait',
                callback: () => {
                    AthenaClient.systems.wheelMenu.update('Wait', waitAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-stopwatch',
            },
            {
                name: 'Lean',
                callback: () => {
                    AthenaClient.systems.wheelMenu.update('Lean', leanAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-airline-seat_recline_extra',
            },
            {
                name: 'Emote',
                callback: () => {
                    AthenaClient.systems.wheelMenu.update('Emote', emoteAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-emoji_people',
            },
            {
                name: 'Common',
                callback: () => {
                    AthenaClient.systems.wheelMenu.update('Common', commonAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-content_copy',
            },
        ],
        true,
    );
}

function init() {
    AthenaClient.systems.hotkeys.add({
        key: KEY_BINDS.ANIMATION,
        description: 'Animations',
        identifier: 'defualt-animation-menu',
        keyDown: handleAnimationMenu,
    });
}

onTicksStart.add(init);
