import * as alt from 'alt-client';
import * as native from 'natives';
import { KEY_BINDS } from '../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { KeybindController } from '../events/keyup';
import { playAnimation } from '../systems/animations';
import { PushVehicle } from '../systems/push';
import { isAnyMenuOpen } from '../utility/menus';
import { WheelMenu } from '../utility/wheelMenu';
import commonAnims from './animationMenus/commonAnims';
import danceAnims from './animationMenus/danceAnims';
import emoteAnims from './animationMenus/emoteAnims';
import funAnims from './animationMenus/funAnims';
import idleAnims from './animationMenus/idleAnims';
import leanAnims from './animationMenus/leanAnims';
import waitAnims from './animationMenus/waitAnims';

function callback(dict: string, name: string, flags: number) {
    if (alt.Player.local.vehicle) {
        return;
    }

    playAnimation(dict, name, flags);
}

function handleAnimationMenu() {
    if (alt.Player.local.vehicle) {
        return;
    }

    if (isAnyMenuOpen()) {
        return;
    }

    if (PushVehicle.isPushing()) {
        return;
    }

    WheelMenu.create(
        'Animations',
        [
            {
                name: '~o~Clear',
                callback: () => {
                    if (alt.Player.local.vehicle) {
                        return;
                    }

                    native.clearPedTasks(alt.Player.local.scriptID);
                }
            },
            {
                name: 'Dance',
                callback: () => {
                    WheelMenu.create('Dance', danceAnims(callback));
                }
            },
            {
                name: 'Idle',
                callback: () => {
                    WheelMenu.create('Idle', idleAnims(callback));
                }
            },
            {
                name: 'Fun',
                callback: () => {
                    WheelMenu.create('Fun', funAnims(callback));
                }
            },
            {
                name: 'Wait',
                callback: () => {
                    WheelMenu.create('Wait', waitAnims(callback));
                }
            },
            {
                name: 'Lean',
                callback: () => {
                    WheelMenu.create('Lean', leanAnims(callback));
                }
            },
            {
                name: 'Emote',
                callback: () => {
                    WheelMenu.create('Emote', emoteAnims(callback));
                }
            },
            {
                name: 'Common',
                callback: () => {
                    WheelMenu.create('Common', commonAnims(callback));
                }
            }
        ],
        true
    );
}

function init() {
    KeybindController.registerKeybind({ key: KEY_BINDS.ANIMATION, singlePress: handleAnimationMenu });
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, init);
