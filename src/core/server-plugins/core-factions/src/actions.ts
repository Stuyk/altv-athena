import * as alt from 'alt-server';
import { Faction } from '../../../shared-plugins/core-factions/interfaces';
import { FACTION_CONFIG } from './config';
import { factionFuncs } from './funcs';

const playerActions: { [key: string]: (player: alt.Player, ...args: any[]) => void } = {};
const tickActions: {
    [key: string]: {
        callback: (faction: Faction) => void;
        msBetweenUpdates: number;
        nextUpdate?: number;
    };
} = {};

class InternalFunctions {
    static init() {
        alt.setInterval(InternalFunctions.tick, 2500);
    }

    static tick() {
        const factions = factionFuncs.utility.getAllFactions();

        if (factions.length <= 0) {
            return;
        }

        const tickActionsCalled = [];

        for (let factionIndex = 0; factionIndex < factions.length; factionIndex++) {
            const faction = factions[factionIndex];
            if (faction.tickActions.length <= 0) {
                continue;
            }

            for (let actionIndex = 0; actionIndex < faction.tickActions.length; actionIndex++) {
                const actionUid = faction.tickActions[actionIndex];
                if (!tickActions[actionUid]) {
                    continue;
                }

                // Propogate tick actions to update after looping all factions.
                const callIndex = tickActionsCalled.findIndex((ac) => ac === actionUid);
                if (callIndex <= -1) {
                    tickActionsCalled.push(tickActions[actionUid]);
                }

                tickActions[actionUid].callback(faction);
            }
        }

        // Update Next Tick Call Times
        for (let i = 0; i < tickActionsCalled.length; i++) {
            tickActions[tickActionsCalled[i]].nextUpdate =
                Date.now() + tickActions[tickActionsCalled[i]].msBetweenUpdates;
        }
    }
}

export class FactionActions {
    /**
     * Given a faction, a rank UID, and an action UID, return the function that will be called when
     * the player uses that action.
     *
     * Will return null if the action cannot be executed by that rank.
     * @param {Faction} faction - Faction,
     * @param {string} rankUid - The rank of the player.
     * @param {string} actionUid - The unique identifier of the action.
     */
    static getPlayerAction(player: alt.Player, actionUid: string): (player: alt.Player, ...args: any[]) => void | null {
        const faction = factionFuncs.utility.get(player.data.faction);
        if (!faction) {
            return null;
        }

        const rank = factionFuncs.player.getPlayerFactionRank(player);
        if (!rank) {
            return null;
        }

        if (!faction.actions[rank.uid]) {
            return null;
        }

        // Permission Check
        if (!factionFuncs.player.isOwnerOrAdmin(player)) {
            const index = faction.actions[rank.uid].findIndex((uid) => uid === actionUid);
            if (index <= -1) {
                return null;
            }
        }

        return playerActions[actionUid];
    }

    /**
     * Unregisters a player action
     *
     * @static
     * @param {string} actionUid
     * @memberof FactionActions
     */
    static removePlayerAction(actionUid: string) {
        delete playerActions[actionUid];
    }

    /**
     * Registers an action callback for internal systems.
     *
     * @static
     * @param {string} actionUid
     * @param {(player: alt.Player, ...args: any[]) => void} callback
     * @memberof FactionActions
     */
    static addPlayerAction(actionUid: string, callback: (player: alt.Player, ...args: any[]) => void) {
        playerActions[actionUid] = callback;
    }

    /**
     * Adds the action to the tickActions dictionary.
     * @param {string} actionUid - A unique identifier for the action.
     * @param {number} msBetweenUpdates - The number of milliseconds between each update. Minimum 5000ms
     * @param callback - (faction: Faction) => void
     */
    static addTickAction(actionUid: string, msBetweenUpdates: number, callback: (faction: Faction) => void) {
        if (msBetweenUpdates < FACTION_CONFIG.FactionActionTickTime) {
            msBetweenUpdates = FACTION_CONFIG.FactionActionTickTime;
        }

        tickActions[actionUid] = {
            msBetweenUpdates,
            callback,
        };
    }

    /**
     * Remove the action from the tickActions dictionary.
     * @param {string} actionUid - The unique identifier for the action.
     */
    static removeTickAction(actionUid: string) {
        delete tickActions[actionUid];
    }
}

InternalFunctions.init();
