import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced.js';

export type IdentifierStrategy = 'account_id' | 'character_id' | 'server_id';

let strategy: IdentifierStrategy = 'server_id';

/**
 * Initialize player selection identifier creation
 *
 */
function init() {
    Athena.player.events.on('selected-character', setPlayerIdentifier);
}

/**
 * Should be set during the server startup phase to change player identification strategies.
 *
 * This will apply to all players when they select a character.
 *
 * DO NOT CHANGE THIS AFTER SERVER STARTUP.
 *
 * @param {IdentifierStrategy} _strategy
 */
export function setIdentificationStrategy(_strategy: IdentifierStrategy) {
    if (Overrides.setIdentificationStrategy) {
        return Overrides.setIdentificationStrategy(_strategy);
    }

    strategy = _strategy;
}

/**
 * Automatically sets the player identification by strategy to the synced meta.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function setPlayerIdentifier(player: alt.Player) {
    if (Overrides.setPlayerIdentifier) {
        return Overrides.setPlayerIdentifier(player);
    }

    if (!player || !player.valid) {
        return;
    }

    const identifier = getIdByStrategy(player);
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        throw new Error(`Could not set identifier for player: ${player.id}, data was not defined.`);
    }

    player.setSyncedMeta(PLAYER_SYNCED_META.IDENTIFICATION_ID, identifier);
}

/**
 * Returns the player by the currently set identification strategy.
 *
 * @param {(number | string)} id
 */
export function getPlayer(id: number | string): alt.Player {
    if (Overrides.getPlayer) {
        return Overrides.getPlayer(id);
    }

    if (typeof id === 'string') {
        id = parseInt(id);
    }

    return alt.Player.all.find((target) => {
        if (!target || !target.valid) {
            return false;
        }

        if (strategy === 'account_id') {
            const accountData = Athena.document.account.get(target);
            if (typeof accountData === 'undefined') {
                return false;
            }

            return accountData.id === id;
        }

        if (strategy === 'character_id') {
            const data = Athena.document.character.get(target);
            if (typeof data === 'undefined') {
                return false;
            }

            return data.character_id === id;
        }

        if (target.id !== id) {
            return false;
        }

        return true;
    });
}

/**
 * Returns the current numerical identifier based on current strategy.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {number}
 */
export function getIdByStrategy(player: alt.Player): number {
    if (Overrides.getIdByStrategy) {
        return Overrides.getIdByStrategy(player);
    }

    const accountData = Athena.document.account.get(player);
    const data = Athena.document.character.get(player);

    if (typeof accountData === 'undefined' || typeof data === 'undefined') {
        alt.logWarning(`Could not fetch player identifier for player: ${player.id} (${player.name})`);
        return -1;
    }

    if (!player || !accountData || !data || !data._id) {
        return -1;
    }

    if (strategy === 'account_id') {
        return accountData.id;
    }

    if (strategy === 'character_id') {
        return data.character_id;
    }

    return player.id;
}

interface IdentifierFuncs {
    setIdentificationStrategy: typeof setIdentificationStrategy;
    setPlayerIdentifier: typeof setPlayerIdentifier;
    getPlayer: typeof getPlayer;
    getIdByStrategy: typeof getIdByStrategy;
}

const Overrides: Partial<IdentifierFuncs> = {};

export function override(functionName: 'setIdentificationStrategy', callback: typeof setIdentificationStrategy);
export function override(functionName: 'setPlayerIdentifier', callback: typeof setPlayerIdentifier);
export function override(functionName: 'getPlayer', callback: typeof getPlayer);
export function override(functionName: 'getIdByStrategy', callback: typeof getIdByStrategy);

/**
 * Used to override identification strategy functions.
 *
 *
 * @param {keyof IdentifierFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof IdentifierFuncs, callback: any): void {
    Overrides[functionName] = callback;
}

init();
