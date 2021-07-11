import * as alt from 'alt-client';
import * as native from 'natives';

import { KEY_BINDS } from '../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { KeybindController } from '../events/keyup';
import { VehicleController } from './vehicle';

const TIME_BETWEEN_CHECKS = 500;
let tick;
let pressedKey = false;
let nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
let description: string;
let position: alt.Vector3;

export class InteractionController {
    /**
     * Initialize the Interaction Controller
     * @static
     * @memberof InteractionController
     */
    static init() {
        if (!tick) {
            tick = alt.setInterval(InteractionController.tick, 0);
        }

        InteractionController.registerKeybinds();
    }

    /**
     * Register default keybind for interactions.
     * @static
     * @memberof InteractionController
     */
    static registerKeybinds() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.INTERACT,
            singlePress: () => {
                pressedKey = true;
            }
        });
    }

    /**
     * Set when a player enters a ColShape Interaction from Server Side
     * @static
     * @param {(string | null)} type
     * @param {alt.Vector3} position
     * @memberof InteractionController
     */
    static set(_position: alt.Vector3, _description: string) {
        if (!_position || !_description) {
            position = null;
            description = null;
            return;
        }

        position = _position;
        description = _description;
    }

    static tick() {
        if (alt.Player.local.isMenuOpen) {
            pressedKey = false;
            return;
        }

        if (alt.Player.local.isChatOpen) {
            pressedKey = false;
            return;
        }

        if (alt.Player.local.meta.isDead) {
            pressedKey = false;
            return;
        }

        // Display Help Text
        if (description && position) {
            native.beginTextCommandDisplayHelp('THREESTRINGS');
            native.addTextComponentSubstringPlayerName(
                `~y~' ${String.fromCharCode(KEY_BINDS.INTERACT).toUpperCase()} ' ~w~${description}`
            );
            native.endTextCommandDisplayHelp(0, false, true, 0);
        }

        if (!pressedKey) {
            return;
        }

        VehicleController.runVehicleControllerTick();

        // Timeout for Key Presses
        if (nextKeyPress > Date.now()) {
            pressedKey = false;
            return;
        }

        nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
        pressedKey = false;
        alt.emitServer(SYSTEM_EVENTS.INTERACTION);
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.set);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InteractionController.init);
