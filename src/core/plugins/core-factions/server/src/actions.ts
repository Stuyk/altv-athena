import * as alt from 'alt-server';
import { Faction } from '../../shared/interfaces';
import { FACTION_CONFIG } from './config';
import { FactionHandler } from './handler';
import { FactionPlayerFuncs } from './playerFuncs';

const playerActions: { [key: string]: (player: alt.Player, ...args: any[]) => void } = {};
const tickActions: {
    [key: string]: {
        callback: (faction: Faction) => void;
        msBetweenUpdates: number;
        nextUpdate?: number;
    };
} = {};

let hasInitialized = false;

class InternalFunctions {
    static init() {
        hasInitialized = true;
        alt.setInterval(InternalFunctions.tick, 1000);
    }

    /**
     * For each faction, for each tick action, if the action is ready to be invoked, invoke it.
     * @returns The faction handler.
     */
    static tick() {
        const factions = FactionHandler.getAllFactions();

        if (factions.length <= 0) {
            return;
        }

        const tickActionsCalled = [];

        // Loop through each faction
        for (let factionIndex = 0; factionIndex < factions.length; factionIndex++) {
            const faction = factions[factionIndex];
            if (!faction.tickActions || faction.tickActions.length <= 0) {
                continue;
            }

            // Loop through each factions passive tick actions
            for (let actionIndex = 0; actionIndex < faction.tickActions.length; actionIndex++) {
                const actionUid = faction.tickActions[actionIndex];
                if (!tickActions[actionUid]) {
                    continue;
                }

                // Check that it's ready to be invoked
                if (tickActions[actionUid].nextUpdate && Date.now() < tickActions[actionUid].nextUpdate) {
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
    static init() {
        if (hasInitialized) {
            return;
        }

        InternalFunctions.init();
    }

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
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return null;
        }

        const rank = FactionPlayerFuncs.getPlayerFactionRank(player);
        if (!rank) {
            return null;
        }

        if (!faction.actions[rank.uid]) {
            return null;
        }

        // Permission Check
        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
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
        if (!hasInitialized) {
            InternalFunctions.init();
        }

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
