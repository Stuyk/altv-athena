import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/extPlayer';
import { CharacterSelectFunctions } from '../views/characters';
import { LoginFunctions } from '../views/login';
import { LoginController } from './login';

const agenda: { [key: string]: (player: alt.Player) => void } = {
    1: LoginFunctions.show, // Discord Login
    2: LoginController.show, // Account Setup / Player Setup
    3: CharacterSelectFunctions.show, // Character Selection / Character Creator
    100: playerFuncs.select.character, // Selected Character / Do Spawn
};

const timelines: {
    [key: string]: {
        index: number;
        agenda: Array<(player: alt.Player, ...args: any[]) => void>;
    };
} = {};

/**
 * Used to create a login pattern.
 * @export
 * @class AgendaSystem
 */
export class AgendaSystem {
    /**
     * Set the agenda to the passed agenda timeline.
     * By Default the Load Order:
     * 1: LoginFunctions.show - Discord Login
     * 2: LoginController.show - Account Setup / Player Setup
     * 3: CharacterSelectFunctions.show - Show Character Select / Character Creator
     * 4-99: <Safe Insertion Screens>
     * 100: Finish Login Based on Selection
     * @static
     * @param {Array<(player: alt.Player, ...args: any[]) => void>} _agenda
     * @memberof AgendaSystem
     */
    static set(id: number, callback: (player: alt.Player) => void) {
        if (id > 100) {
            alt.log(`~r~Failed to Set Agenda Timeline @ ${id}.`);
            return;
        }

        if (agenda[id]) {
            alt.log(`Overwrote Agenda @ ${id} with new callback.`);
        }

        agenda[id] = callback;
        alt.log(`~g~Added Agenda to Timeline @ ${id}`);
    }

    /**
     * Get the current agenda platform.
     * @static
     * @return { [key: string]: (player: alt.Player, ...args: any[]) => void }
     * @memberof AgendaSystem
     */
    static get(): { [key: string]: (player: alt.Player, ...args: any[]) => void } {
        return agenda;
    }

    static getAsArray(): Array<(player: alt.Player) => void> {
        const timeline = [];

        Object.keys(agenda).forEach((key) => {
            timeline.push(agenda[key]);
        });

        return timeline;
    }

    /**
     * Get the next agenda sequence to show the player.
     * @static
     * @param {alt.Player} player
     * @param {boolean} startNew Should this start from index 0?
     * @memberof AgendaSystem
     */
    static getNext(player: alt.Player, startNew = false): (player: alt.Player, ...args: any[]) => void | null {
        if (!timelines[player.id] || startNew) {
            timelines[player.id] = {
                index: -1,
                agenda: AgendaSystem.getAsArray(),
            };
        }

        timelines[player.id].index += 1;
        return timelines[player.id].agenda[timelines[player.id].index];
    }

    /**
     * Go to the next agenda sequence to show the player.
     * @static
     * @param {alt.Player} player
     * @param {boolean} [startNew=false]
     * @memberof AgendaSystem
     */
    static goNext(player: alt.Player, startNew = false, ...args: any[]) {
        const nextCallback = AgendaSystem.getNext(player, startNew);
        if (!nextCallback) {
            return;
        }

        nextCallback(player, ...args);
    }

    /**
     * Navigate to a specific index in the timeline.
     * @static
     * @param {alt.Player} player
     * @param {number} index
     * @memberof AgendaSystem
     */
    static getFromIndex(player: alt.Player, index: number): Function | null {
        return timelines[player.id].agenda[index];
    }

    /**
     * Show the previous agenda timeline to the player.
     * @static
     * @param {alt.Player} player
     * @memberof AgendaSystem
     */
    static getPrev(player: alt.Player): Function | null {
        if (!timelines[player.id]) {
            alt.log(`~r~Failed to Get Previous Agenda Timeline for ${player.id}`);
            return null;
        }

        timelines[player.id].index -= 1;
        if (timelines[player.id].index < 0) {
            timelines[player.id].index = 0;
        }

        return timelines[player.id].agenda[timelines[player.id].index];
    }
}
