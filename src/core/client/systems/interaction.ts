import * as alt from 'alt-client';

import { KEY_BINDS } from '@AthenaShared/enums/keyBinds';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import keyboardMap from '@AthenaShared/information/keyboardMap';
import IClientInteraction from '@AthenaShared/interfaces/iClientInteraction';
import { Interaction } from '@AthenaShared/interfaces/interaction';
import { IWheelOptionExt } from '@AthenaShared/interfaces/wheelMenu';
import { KeybindController } from '@AthenaClient/events/keyup';
import { Timer } from '@AthenaClient/utility/timers';
import { WheelMenu } from '@AthenaClient/views/wheelMenu';
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
        // KeybindController.registerKeybind({
        //     key: KEY_BINDS.INTERACT,
        //     singlePress: () => {
        //         pressedKey = true;
        //     },
        // });
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
