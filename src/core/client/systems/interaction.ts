import * as alt from 'alt-client';
import * as native from 'natives';

import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { KEY_BINDS } from '../../shared/enums/KeyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { VEHICLE_STATE } from '../../shared/enums/Vehicle';
import { View_Events_Inventory } from '../../shared/enums/Views';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { distance2d, getClosestVectorByPos } from '../../shared/utility/vector';
import { KeybindController } from '../events/keyup';
import { drawText2D } from '../utility/text';
import { drawTexture } from '../utility/texture';
import { Timer } from '../utility/timers';

const TIME_BETWEEN_CHECKS = 500;
let tick: number;
let pressedKey = false;
let nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
let disableMarker: boolean = false;
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
            },
        });
    }

    /**
     * Set when a player enters a ColShape Interaction from Server Side
     * @static
     * @param {(string | null)} type
     * @param {alt.Vector3} position
     * @memberof InteractionController
     */
    static set(_position: alt.Vector3, _description: string, _disableMarker: boolean) {
        if (!_position || !_description) {
            position = null;
            description = null;
            return;
        }

        position = _position;
        description = _description;
        disableMarker = _disableMarker;
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

        if (alt.Player.local.isWheelMenuOpen) {
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

        if (alt.Player.local.closestItem) {
            const groundItem = alt.Player.local.closestItem;
            if (!groundItem) {
                return;
            }

            alt.emitServer(View_Events_Inventory.Pickup, groundItem.uid);
            return;
        }

        alt.emitServer(SYSTEM_EVENTS.INTERACTION);
    }

    static appendText(originalText: string, key: number, description: string): string {
        return originalText + `~y~' ${String.fromCharCode(key).toUpperCase()} ' ~w~${description} ~n~`;
    }

    static getCombinedText(key: number, description: string): string {
        return `~y~' ${String.fromCharCode(key).toUpperCase()} ' ~w~${description} ~n~`;
    }

    static drawInteractText() {
        const textToDraw = [];

        // Display Help Text - Only will show if the player is not near any items.
        if (description && position && !alt.Player.local.closestItem) {
            const newText = InteractionController.getCombinedText(KEY_BINDS.INTERACT, description);
            textToDraw.push(newText);

            if (!disableMarker) {
                drawTexture('mpmissmarkers128', 'corona_marker', position, 0.1);
            }
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
                z: vehicle.pos.z,
            };

            const isInBack = distance2d(alt.Player.local.pos, backPosition) <= 2;

            if (vehicleDistance <= SHARED_CONFIG.MAX_VEHICLE_INTERACTION_RANGE) {
                const newPosition = vehicle.pos.add(0, 0, 1);
                if (vehicle.getStreamSyncedMeta(VEHICLE_STATE.LOCKSYMBOL) == true) {
                    if (isVehicleLocked) {
                        drawTexture('mpsafecracking', 'lock_closed', newPosition, 1);
                    } else {
                        drawTexture('mpsafecracking', 'lock_open', newPosition, 1);
                    }
                }

                if (!isVehicleLocked) {
                    // Press 'F' to enter vehicle
                    const enterText = LocaleController.get(LOCALE_KEYS.VEHICLE_ENTER_VEHICLE);

                    const newText = InteractionController.getCombinedText(KEY_BINDS.VEHICLE_FUNCS, enterText);
                    textToDraw.push(newText);
                }

                if (!isVehicleLocked && isInBack) {
                    // Press 'U' for Options
                    const optionsText = 'Options';
                    const newText = InteractionController.getCombinedText(KEY_BINDS.VEHICLE_OPTIONS, optionsText);
                    textToDraw.push(newText);
                }

                // Press 'X' to lock vehicle
                if (vehicle.getStreamSyncedMeta(VEHICLE_STATE.LOCKSYMBOL) == true) {
                    const lockText = LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_LOCK);
                    const newText = InteractionController.getCombinedText(KEY_BINDS.VEHICLE_LOCK, lockText);
                    textToDraw.push(newText);
                }
            }
        } else if (alt.Player.local.vehicle) {
            const engineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);

            if (!engineOn) {
                // Press 'Y' to toggle engine
                const engineText = LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_ENGINE);
                const newText = InteractionController.getCombinedText(KEY_BINDS.VEHICLE_ENGINE, engineText);
                textToDraw.push(newText);
            }
        }

        if (!alt.Player.local.vehicle && alt.Player.local.closestItem) {
            const groundItem = alt.Player.local.closestItem;
            const newText = InteractionController.getCombinedText(
                KEY_BINDS.INTERACT,
                `${groundItem.item.item.name} (x${groundItem.item.item.quantity})`,
            );
            textToDraw.push(newText);
        }

        if (textToDraw.length <= 0) {
            return;
        }

        for (let i = 0; i < textToDraw.length; i++) {
            const text = textToDraw[i];
            drawText2D(text, { x: 0.01, y: 0.01 }, 0.5, new alt.RGBA(255, 255, 255, 255), 1);
        }

        // Draw the Help Text (Top Left)
        // native.beginTextCommandDisplayHelp('THREESTRINGS');
        // native.addTextComponentSubstringPlayerName(interactText);
        // native.endTextCommandDisplayHelp(0, false, false, 0);
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.set);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InteractionController.init);
