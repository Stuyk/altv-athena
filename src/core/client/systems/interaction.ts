import * as alt from 'alt-client';
import * as native from 'natives';
import { SHARED_CONFIG } from '../../shared/configurations/shared';

import { KEY_BINDS } from '../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { distance2d, getClosestVectorByPos } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { drawTexture, loadTexture } from '../utility/texture';
import { Timer } from '../utility/timers';

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
            tick = Timer.createInterval(InteractionController.tick, 0, 'interaction.ts');
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

        loadTexture('mpsafecracking');
        loadTexture('mpmissmarkers128');
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

        InteractionController.drawInteractText();

        if (!pressedKey) {
            return;
        }

        // Timeout for Key Presses
        if (nextKeyPress > Date.now()) {
            pressedKey = false;
            return;
        }

        nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
        pressedKey = false;
        alt.emitServer(SYSTEM_EVENTS.INTERACTION);
    }

    static appendText(originalText: string, key: number, description: string): string {
        return originalText + `~y~' ${String.fromCharCode(key).toUpperCase()} ' ~w~${description} ~n~`;
    }

    static drawInteractText() {
        let interactText = '';

        // Display Help Text
        if (description && position) {
            interactText = InteractionController.appendText(interactText, KEY_BINDS.INTERACT, description);

            loadTexture('mpmissmarkers128').then(() => {
                if (!position) {
                    return;
                }

                drawTexture('mpmissmarkers128', 'corona_marker', position, 0.3);
            });
        }

        const vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, alt.Vehicle.all, 'pos');

        if (!alt.Player.local.vehicle && vehicle) {
            const isVehicleLocked = native.getVehicleDoorLockStatus(vehicle.scriptID) === 2;
            const vehicleDistance = distance2d(alt.Player.local.pos, vehicle.pos);

            // Get Forward Vehicle Position
            const vehicleFwd = native.getEntityForwardVector(vehicle.scriptID);
            const backPosition = {
                x: vehicle.pos.x - vehicleFwd.x * 2,
                y: vehicle.pos.y - vehicleFwd.y * 2,
                z: vehicle.pos.z
            };

            const isInBack = distance2d(alt.Player.local.pos, backPosition) <= 2;

            if (vehicleDistance <= SHARED_CONFIG.MAX_INTERACTION_RANGE) {
                if (!native.hasStreamedTextureDictLoaded('mpsafecracking')) {
                    loadTexture('mpsafecracking');
                }

                loadTexture('mpsafecracking').then(() => {
                    const newPosition = vehicle.pos.add(0, 0, 1);

                    if (isVehicleLocked) {
                        drawTexture('mpsafecracking', 'lock_closed', newPosition, 1);
                    } else {
                        drawTexture('mpsafecracking', 'lock_open', newPosition, 1);
                    }
                });

                if (!isVehicleLocked) {
                    // Press 'F' to enter vehicle
                    const enterText = LocaleController.get(LOCALE_KEYS.VEHICLE_ENTER_VEHICLE);
                    interactText = InteractionController.appendText(interactText, KEY_BINDS.VEHICLE_FUNCS, enterText);
                }

                if (!isVehicleLocked && isInBack) {
                    // Press 'U' for Options
                    const optionsText = 'Options';
                    interactText = InteractionController.appendText(
                        interactText,
                        KEY_BINDS.VEHICLE_OPTIONS,
                        optionsText
                    );
                }

                // Press 'X' to lock vehicle
                const lockText = LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_LOCK);
                interactText = InteractionController.appendText(interactText, KEY_BINDS.VEHICLE_LOCK, lockText);
            }
        } else if (alt.Player.local.vehicle) {
            const engineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);

            if (!engineOn) {
                // Press 'Y' to toggle engine
                const engineText = LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_ENGINE);
                interactText = InteractionController.appendText(interactText, KEY_BINDS.VEHICLE_ENGINE, engineText);
            }
        }

        // Replace the last ~n~ in the interaction text.
        interactText = interactText.replace(/~n~$/, '');
        if (interactText === '') {
            return;
        }

        // Draw the Help Text (Top Left)
        native.beginTextCommandDisplayHelp('THREESTRINGS');
        native.addTextComponentSubstringPlayerName(interactText);
        native.endTextCommandDisplayHelp(0, false, false, 0);
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.set);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InteractionController.init);
