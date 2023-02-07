import * as alt from 'alt-client';
import * as native from 'natives';

import { KEY_BINDS } from '@AthenaShared/enums/keyBinds';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { View_Events_Inventory } from '@AthenaShared/enums/views';
import keyboardMap from '@AthenaShared/information/keyboardMap';
import IClientInteraction from '@AthenaShared/interfaces/iClientInteraction';
import { Interaction } from '@AthenaShared/interfaces/interaction';
import { IWheelOptionExt } from '@AthenaShared/interfaces/wheelMenu';
import { distance } from '@AthenaShared/utility/vector';
import { KeybindController } from '@AthenaClient/events/keyup';
import { NpcWheelMenu } from '@AthenaClient/menus/npc';
import { ObjectWheelMenu } from '@AthenaClient/menus/object';
import { PlayerWheelMenu } from '@AthenaClient/menus/player';
import { VehicleWheelMenu } from '@AthenaClient/menus/vehicle';
import { Timer } from '@AthenaClient/utility/timers';
import { WheelMenu } from '@AthenaClient/views/wheelMenu';
import { CameraTarget } from './cameraTarget';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';

const LEFT_SHIFT = 16;
const TIME_BETWEEN_CHECKS = 500;
let hookInteractions: Array<(interactions: Array<IClientInteraction>) => void> = [];
let tick: number;
let pressedKey = false;
let nextKeyPress = Date.now() + TIME_BETWEEN_CHECKS;
let interaction: Interaction = null;
let temporaryInteraction: string = null;
let leftShiftDown = false;

export const InteractionController = {
    /**
     * Initialize the Interaction Controller
     * @static
     * @memberof InteractionController
     */
    init() {
        alt.onServer(SYSTEM_EVENTS.INTERACTION_TEMPORARY, InteractionController.setTemporaryInteraction);
        alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, InteractionController.set);

        if (!tick) {
            tick = Timer.createInterval(InteractionController.tick, 0, 'interaction.ts');
        }

        InteractionController.registerKeybinds();
        alt.on('keydown', InteractionController.keydown);
        alt.on('keyup', InteractionController.keyup);
    },

    keydown(key: number) {
        if (key !== LEFT_SHIFT) {
            return;
        }

        leftShiftDown = true;
    },

    keyup(key: number) {
        if (key !== LEFT_SHIFT) {
            return;
        }

        leftShiftDown = false;
    },

    /**
     * Interaction information is fed through this callback.
     * @static
     * @param {(callback: IClientInteraction) => void} callback
     * @memberof InteractionController
     */
    addInfoCallback(callback: (interactions: Array<IClientInteraction>) => void) {
        hookInteractions.push(callback);
    },

    /**
     * Adds a temporary interaction that calls back a server-side event.
     * @static
     * @param {(string | null)} eventName
     * @memberof InteractionController
     */
    setTemporaryInteraction(eventName: string | null) {
        temporaryInteraction = eventName;
    },

    /**
     * Register default keybind for interactions.
     * @static
     * @memberof InteractionController
     */
    registerKeybinds() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.INTERACT,
            singlePress: () => {
                pressedKey = true;
            },
        });
    },

    /**
     * Set when a player enters a ColShape Interaction from Server Side
     * @static
     * @param {(string | null)} type
     * @param {alt.Vector3} position
     * @memberof InteractionController
     */
    set(_interaction: Interaction) {
        if (!_interaction) {
            interaction = null;
            return;
        }

        interaction = _interaction;
    },

    tick() {
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
        // const closestItems = ClientItemStreamer.getClosestItems();
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
                    const targetCoords = native.getEntityCoords(closestTarget.scriptID, false);
                    let item = null;
                    // for (const closestItem of closestItems) {
                    //     if (closestItem.item && closestItem.item.item && closestItem.item.item.model) {
                    //         const itemHash = alt.hash(closestItem.item.item.model);
                    //         const itemDistance = parseFloat(distance(targetCoords, closestItem.pos).toFixed(2));
                    //         if (hash === itemHash && itemDistance <= 0.7) {
                    //             item = closestItem;
                    //             break;
                    //         }
                    //     }
                    // }

                    wheelOptions.push({
                        name: `Object`,
                        icon: 'icon-lightbulb',
                        data: [closestTarget.scriptID],
                        callback: (scriptID: number) => {
                            ObjectWheelMenu.openMenu(scriptID, item);
                        },
                    });
                }
            }
        }

        // if (closestItems.length >= 1) {
        //     for (const item of closestItems) {
        //         wheelOptions.push({
        //             name: `Pickup ${item.item.item.name} (x${item.item.item.quantity})`,
        //             icon: 'icon-move_to_inbox',
        //             callback: () => {
        //                 alt.emitServer(View_Events_Inventory.Pickup, item.uid);
        //             },
        //         });
        //     }
        // }

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
    },

    appendText(originalText: string, key: number, description: string): string {
        return originalText + `~y~' ${String.fromCharCode(key).toUpperCase()} ' ~w~${description} ~n~`;
    },

    getInteractionInfo(key: number, description: string): IClientInteraction {
        let legibleName = keyboardMap[key];
        if (!legibleName) {
            legibleName = `UNK_${key}`;
        }

        return {
            keyPress: legibleName,
            description,
        };
    },
};

onTicksStart.add(InteractionController.init);
