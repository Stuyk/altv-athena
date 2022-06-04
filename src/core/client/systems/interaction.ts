import * as alt from 'alt-client';
import * as native from 'natives';

import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Inventory } from '../../shared/enums/views';
import keyboardMap from '../../shared/information/keyboardMap';
import IClientInteraction from '../../shared/interfaces/iClientInteraction';
import { Interaction } from '../../shared/interfaces/interaction';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { KeybindController } from '../events/keyup';
import { NpcWheelMenu } from '../menus/npc';
import { ObjectWheelMenu } from '../menus/object';
import { PlayerWheelMenu } from '../menus/player';
import { VehicleWheelMenu } from '../menus/vehicle';
import { ClientItemStreamer } from '../streamers/item';
import { Timer } from '../utility/timers';
import { WheelMenu } from '../views/wheelMenu';
import { CameraTarget } from './cameraTarget';

const LEFT_SHIFT = 16;
const TIME_BETWEEN_CHECKS = 500;
let hookInteractions: Array<(interactions: Array<IClientInteraction>) => void> = [];
let tick: number;
let pressedKey = false;
let nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
let interaction: Interaction = null;
let temporaryInteraction: string = null;
let leftShiftDown = false;

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
        alt.on('keydown', InteractionController.keydown);
        alt.on('keyup', InteractionController.keyup);
    }

    private static keydown(key: number) {
        if (key !== LEFT_SHIFT) {
            return;
        }

        leftShiftDown = true;
    }

    private static keyup(key: number) {
        if (key !== LEFT_SHIFT) {
            return;
        }

        leftShiftDown = false;
    }

    /**
     * Interaction information is fed through this callback.
     * @static
     * @param {(callback: IClientInteraction) => void} callback
     * @memberof InteractionController
     */
    static addInfoCallback(callback: (interactions: Array<IClientInteraction>) => void) {
        hookInteractions.push(callback);
    }

    /**
     * Adds a temporary interaction that calls back a server-side event.
     * @static
     * @param {(string | null)} eventName
     * @memberof InteractionController
     */
    static setTemporaryInteraction(eventName: string | null) {
        temporaryInteraction = eventName;
    }

    /**
     * Register default keybind for interactions.
     * @static
     * @memberof InteractionController
     */
    private static registerKeybinds() {
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
    static set(_interaction: Interaction) {
        if (!_interaction) {
            interaction = null;
            return;
        }

        interaction = _interaction;
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

        // InteractionController.drawInteractText();

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

        // Here we will construct a dynamic wheel menu based on the amount of options we have.
        const wheelOptions: Array<IWheelOptionExt> = [];
        const closestTarget = CameraTarget.get();
        const closestItems = ClientItemStreamer.getClosestItems();
        const closestInteraction = interaction;
        const closestTempInteraction = temporaryInteraction;

        if (closestTempInteraction) {
            wheelOptions.push({
                name: 'Closest Interaction',
                icon: 'icon-warning',
                emitServer: closestTempInteraction,
                color: 'orange',
            });
        }

        if (closestInteraction) {
            wheelOptions.push({
                name: closestInteraction.description ? closestInteraction.description : 'Closest Interaction',
                icon: 'icon-send',
                emitServer: SYSTEM_EVENTS.INTERACTION,
                color: 'green',
            });
        }

        if (closestTarget) {
            // Only show this if they press shift + interaction
            if (alt.Player.local.vehicle && leftShiftDown) {
                const model = native.getDisplayNameFromVehicleModel(alt.Player.local.vehicle.model);
                wheelOptions.push({
                    name: model,
                    icon: 'icon-directions_car',
                    data: [alt.Player.local.vehicle],
                    callback: (_vehicle: alt.Vehicle) => {
                        VehicleWheelMenu.openInVehicleMenu(_vehicle);
                    },
                });
            }

            if (!alt.Player.local.vehicle && closestTarget.type === 'vehicle') {
                const vehicle = alt.Vehicle.all.find((v) => v && v.valid && v.scriptID === closestTarget.scriptID);

                if (vehicle) {
                    const model = native.getDisplayNameFromVehicleModel(vehicle.model);
                    wheelOptions.push({
                        name: model,
                        icon: 'icon-directions_car',
                        data: [vehicle],
                        callback: (_vehicle: alt.Vehicle) => {
                            VehicleWheelMenu.openMenu(_vehicle);
                        },
                    });
                }
            }

            // Player Type
            if (closestTarget.type === 'player') {
                const player = alt.Player.all.find((p) => p && p.valid && p.scriptID === closestTarget.scriptID);

                if (player) {
                    wheelOptions.push({
                        name: `Player`,
                        icon: 'icon-person',
                        data: [player],
                        callback: (_player: alt.Player) => {
                            PlayerWheelMenu.openMenu(_player);
                        },
                    });
                }
            }

            // NPC Type
            if (closestTarget.type === 'npc') {
                wheelOptions.push({
                    name: `NPC`,
                    icon: 'icon-user-tie',
                    data: [closestTarget.scriptID],
                    callback: (scriptID: number) => {
                        NpcWheelMenu.openMenu(scriptID);
                    },
                });
            }

            // Object Type
            if (closestTarget.type === 'object') {
                const hash = native.getEntityModel(closestTarget.scriptID);
                const isValid = ObjectWheelMenu.isModelValidObject(hash);
                if (isValid) {
                    wheelOptions.push({
                        name: `Object`,
                        icon: 'icon-lightbulb',
                        data: [closestTarget.scriptID],
                        callback: (scriptID: number) => {
                            ObjectWheelMenu.openMenu(scriptID);
                        },
                    });
                }
            }
        }

        if (closestItems.length >= 1) {
            for (const item of closestItems) {
                wheelOptions.push({
                    name: `Pickup ${item.item.item.name} (x${item.item.item.quantity})`,
                    icon: 'icon-move_to_inbox',
                    callback: () => {
                        alt.emitServer(View_Events_Inventory.Pickup, item.uid);
                    },
                });
            }
        }

        // Force Single Option Invoke
        if (wheelOptions.length === 1) {
            const option = wheelOptions[0];

            if (option.callback) {
                const data = option.data ? option.data : [];
                option.callback(...data);
                return;
            }

            if (option.emitServer) {
                const data = option.data ? option.data : [];
                alt.emitServer(option.emitServer, ...data);
                return;
            }

            if (option.emitClient) {
                const data = option.data ? option.data : [];
                alt.emit(option.emitClient, ...data);
            }

            return;
        }

        if (wheelOptions.length <= 0) {
            return;
        }

        WheelMenu.open('Options', wheelOptions, true);
    }

    static appendText(originalText: string, key: number, description: string): string {
        return originalText + `~y~' ${String.fromCharCode(key).toUpperCase()} ' ~w~${description} ~n~`;
    }

    static getInteractionInfo(key: number, description: string): IClientInteraction {
        let legibleName = keyboardMap[key];
        if (!legibleName) {
            legibleName = `UNK_${key}`;
        }

        return {
            keyPress: legibleName,
            description,
        };
    }

    static drawInteractText() {
        // const interactionInfo = [];
        // // Display Help Text - Only will show if the player is not near any items.
        // if (interaction && interaction.description && !alt.Player.local.closestItem) {
        //     const newText = InteractionController.getInteractionInfo(KEY_BINDS.INTERACT, interaction.description);
        //     interactionInfo.push(newText);
        //     // ! --- Debug Function
        //     if (interaction.debug) {
        //         drawText3D(`${interaction.uid}`, interaction.position, 0.4, new alt.RGBA(255, 255, 255, 100));
        //     }
        // }
        // const vehicle = getClosestVectorByPos<alt.Vehicle>(alt.Player.local.pos, alt.Vehicle.all, 'pos');
        // if (!alt.Player.local.vehicle && vehicle) {
        //     const isVehicleLocked = native.getVehicleDoorLockStatus(vehicle.scriptID) === 2;
        //     const vehicleDistance = distance2d(alt.Player.local.pos, vehicle.pos);
        //     // Get Forward Vehicle Position
        //     const vehicleFwd = native.getEntityForwardVector(vehicle.scriptID);
        //     const backPosition = {
        //         x: vehicle.pos.x - vehicleFwd.x * 2,
        //         y: vehicle.pos.y - vehicleFwd.y * 2,
        //         z: vehicle.pos.z,
        //     };
        //     const isInBack = distance2d(alt.Player.local.pos, backPosition) <= 2;
        //     if (vehicleDistance <= SHARED_CONFIG.MAX_VEHICLE_INTERACTION_RANGE) {
        //         const newPosition = vehicle.pos.add(0, 0, 1);
        //         const isDestroyed = native.getVehicleEngineHealth(vehicle.scriptID) <= 0;
        //         if (vehicle.getStreamSyncedMeta(VEHICLE_STATE.LOCKSYMBOL) == true && !isDestroyed) {
        //             drawText3D(isVehicleLocked ? '~r~L' : '~g~U', newPosition, 0.4, new alt.RGBA(255, 255, 255, 125));
        //         }
        //         if (!isVehicleLocked && !isDestroyed) {
        //             // Press 'F' to enter vehicle
        //             const enterText = LocaleController.get(LOCALE_KEYS.VEHICLE_ENTER_VEHICLE);
        //             const newText = InteractionController.getInteractionInfo(KEY_BINDS.VEHICLE_FUNCS, enterText);
        //             interactionInfo.push(newText);
        //         }
        //         if (!isVehicleLocked && isInBack && !isDestroyed) {
        //             // Press 'U' for Options
        //             const optionsText = 'Options';
        //             const newText = InteractionController.getInteractionInfo(KEY_BINDS.VEHICLE_OPTIONS, optionsText);
        //             interactionInfo.push(newText);
        //         }
        //         // Press 'X' to lock vehicle
        //         if (vehicle.getStreamSyncedMeta(VEHICLE_STATE.LOCK_INTERACTION_INFO) == true && !isDestroyed) {
        //             const lockText = LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_LOCK);
        //             const newText = InteractionController.getInteractionInfo(KEY_BINDS.VEHICLE_LOCK, lockText);
        //             interactionInfo.push(newText);
        //         }
        //     }
        // } else if (alt.Player.local.vehicle) {
        //     const engineOn = native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID);
        //     if (!engineOn) {
        //         // Press 'Y' to toggle engine
        //         const engineText = LocaleController.get(LOCALE_KEYS.VEHICLE_TOGGLE_ENGINE);
        //         const newText = InteractionController.getInteractionInfo(KEY_BINDS.VEHICLE_ENGINE, engineText);
        //         interactionInfo.push(newText);
        //     }
        // }
        // if (!alt.Player.local.vehicle && alt.Player.local.closestItem) {
        //     const groundItem = alt.Player.local.closestItem;
        //     const newText = InteractionController.getInteractionInfo(
        //         KEY_BINDS.INTERACT,
        //         `${groundItem.item.item.name} (x${groundItem.item.item.quantity})`,
        //     );
        //     interactionInfo.push(newText);
        // }
        // for (let i = 0; i < hookInteractions.length; i++) {
        //     hookInteractions[i](interactionInfo);
        // }
    }
}

alt.onServer(SYSTEM_EVENTS.INTERACTION_TEMPORARY, InteractionController.setTemporaryInteraction);
alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.set);
alt.onceServer(SYSTEM_EVENTS.TICKS_START, InteractionController.init);
