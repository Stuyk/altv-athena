import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';

import { KEY_BINDS } from '@AthenaShared/enums/keyBinds';
import { playAnimation } from '@AthenaClient/systems/animations';
import { WheelMenu } from '@AthenaClient/views/wheelMenu';
import commonAnims from './animationMenus/commonAnims';
import danceAnims from './animationMenus/danceAnims';
import emoteAnims from './animationMenus/emoteAnims';
import funAnims from './animationMenus/funAnims';
import idleAnims from './animationMenus/idleAnims';
import leanAnims from './animationMenus/leanAnims';
import waitAnims from './animationMenus/waitAnims';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';

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

    WheelMenu.open(
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
                    WheelMenu.update('Dance', danceAnims(callback), true);
                },
                doNotClose: true,
                icon: 'icon-directions_run',
            },
            {
                name: 'Idle',
                callback: () => {
                    WheelMenu.update('Idle', idleAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-timer',
            },
            {
                name: 'Fun',
                callback: () => {
                    WheelMenu.update('Fun', funAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-celebration',
            },
            {
                name: 'Wait',
                callback: () => {
                    WheelMenu.update('Wait', waitAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-stopwatch',
            },
            {
                name: 'Lean',
                callback: () => {
                    WheelMenu.update('Lean', leanAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-airline-seat_recline_extra',
            },
            {
                name: 'Emote',
                callback: () => {
                    WheelMenu.update('Emote', emoteAnims(callback));
                },
                doNotClose: true,
                icon: 'icon-emoji_people',
            },
            {
                name: 'Common',
                callback: () => {
                    WheelMenu.update('Common', commonAnims(callback));
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
