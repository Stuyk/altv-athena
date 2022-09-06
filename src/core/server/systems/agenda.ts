import * as alt from 'alt-server';

const agenda: { [key: string]: (player: alt.Player) => void } = {};

export enum AgendaOrder {
    'LOGIN_SYSTEM' = 1,
    'CHARACTER_SELECT' = 99,
}

const timelines: {
    [key: string]: {
        agendaIndex: number;
        agenda: Array<{ index: number; callback: (player: alt.Player) => void }>;
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
            alt.log(`~r~Failed to Set Agenda Timeline @ (${id}).`);
            return;
        }

        if (agenda[id]) {
            alt.log(`Overwrote Agenda @ (${id}) with new callback.`);
        }

        agenda[id] = callback;
        alt.log(`~g~Added Agenda to Timeline @ (${id})`);
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

    static getAsArray(): Array<{ index: number; callback: (player: alt.Player) => void }> {
        const timeline: Array<{ index: number; callback: (player: alt.Player) => void }> = [];

        Object.keys(agenda).forEach((key) => {
            timeline.push({ index: parseInt(key), callback: agenda[key] });
        });

        return timeline;
    }

    /**
     * Initializes an agenda system for a player.
     * Does not auto-force them to next agenda.
     *
     * @static
     * @param {alt.Player} player
     * @memberof AgendaSystem
     */
    static initPlayer(player: alt.Player) {
        timelines[player.id] = {
            agendaIndex: -1,
            agenda: AgendaSystem.getAsArray(),
        };
    }

    /**
     * Get the next agenda sequence to show the player.
     * @static
     * @param {alt.Player} player
     * @param {boolean} startNew Should this start from index 0?
     * @memberof AgendaSystem
     */
    static getNext(player: alt.Player, startNew = false): (player: alt.Player, ...args: any[]) => void | null {
        if (!player || !player.valid) {
            return null;
        }

        if (!timelines[player.id] || startNew) {
            timelines[player.id] = {
                agendaIndex: -1,
                agenda: AgendaSystem.getAsArray(),
            };
        }

        timelines[player.id].agendaIndex += 1;

        if (!timelines[player.id].agenda[timelines[player.id].agendaIndex]) {
            return null;
        }

        return timelines[player.id].agenda[timelines[player.id].agendaIndex].callback;
    }

    /**
     * Go to the agenda at the given index and execute the callback.
     * @param player - The player who is using the command.
     * @param {number} index - The index of the agenda.
     */
    static goToAgenda(player: alt.Player, index: number) {
        if (!timelines[player.id]) {
            timelines[player.id] = {
                agendaIndex: -1,
                agenda: AgendaSystem.getAsArray(),
            };
        }

        const actualAgendaIndex = timelines[player.id].agenda.findIndex((x) => x.index === index);
        if (actualAgendaIndex <= -1) {
            throw new Error(`Agenda at ${index} does not exist. Please use correct index.`);
        }

        const agenda = timelines[player.id].agenda[actualAgendaIndex];
        timelines[player.id].agendaIndex = actualAgendaIndex;
        agenda.callback(player);
    }

    /**
     * Go to the next agenda sequence to show the player.
     * @static
     * @param {alt.Player} player
     * @param {boolean} [startNew=false]
     * @memberof AgendaSystem
     */
    static goNext(player: alt.Player, startNew = false, ...args: any[]) {
        if (!player || !player.valid) {
            return;
        }

        const nextCallback = AgendaSystem.getNext(player, startNew);
        if (!nextCallback) {
            return;
        }

        alt.log(`~g~Going to next agenda @ (${timelines[player.id].agendaIndex})`);
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
        return timelines[player.id].agenda[index].callback;
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

        timelines[player.id].agendaIndex -= 1;
        if (timelines[player.id].agendaIndex < 0) {
            timelines[player.id].agendaIndex = 0;
        }

        return timelines[player.id].agenda[timelines[player.id].agendaIndex].callback;
    }
}
