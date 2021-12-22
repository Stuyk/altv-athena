import * as alt from 'alt-server';

const agenda: { [key: string]: Function } = {};
const timelines: {
    [key: string]: {
        index: number;
        agenda: Array<Function>;
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
     * @static
     * @param {Array<Function>} _agenda
     * @memberof AgendaSystem
     */
    static set(id: number, callback: Function) {
        if (id > 100) {
            alt.log(`~r~Failed to Set Agenda Timeline @ ${id}`);
            return;
        }

        agenda[id] = callback;
        alt.log(`~g~Added Agenda to Timeline @ ${id}`);
    }

    /**
     * Get the current agenda platform.
     * @static
     * @return { [key: string]: Function }
     * @memberof AgendaSystem
     */
    static get(): { [key: string]: Function } {
        return agenda;
    }

    static getAsArray(): Array<Function> {
        const timeline = [];

        Object.keys(agenda).forEach((key) => {
            timeline.push(agenda[key]);
        });

        return timeline;
    }

    /**
     * Navigate to the next agenda timeline to show the player.
     * @static
     * @param {alt.Player} player
     * @param {boolean} startNew Should this start from index 0?
     * @memberof AgendaSystem
     */
    static getNext(player: alt.Player, startNew = false): Function | null {
        if (!timelines[player.id] || startNew) {
            timelines[player.id].index = -1;
            timelines[player.id].agenda = AgendaSystem.getAsArray();
        }

        timelines[player.id].index += 1;
        return timelines[player.id].agenda[timelines[player.id].index];
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
