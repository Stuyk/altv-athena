import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { PlayerEvents } from '../events/playerEvents';

type IdentifierStrategy = 'account_id' | 'character_id' | 'server_id';

let strategy: IdentifierStrategy = 'server_id';

const IdentityRef = {
    /**
     * Initialize player selection identifier creation
     *
     */
    init() {
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, IdentityRef.setPlayerIdentifier);
    },
    /**
     * Should be set during the server startup phase to change player identification strategies.
     * This will apply to all players when they select a character.
     * DO NOT CHANGE THIS AFTER SERVER STARTUP.
     *
     * @static
     * @param {IdentifierStrategy} _strategy
     * @memberof Identifier
     */
    setIdentificationStrategy(_strategy: IdentifierStrategy) {
        strategy = _strategy;
    },
    /**
     * Automatically sets the player identification by strategy to the synced meta.
     *
     * @static
     * @memberof Identifier
     */
    setPlayerIdentifier(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        const identifier = IdentityRef.getIdByStrategy(player);
        alt.log(`${player.data.name} ID join and set to ${identifier} using id strategy ${strategy}.`);
        player.setSyncedMeta(PLAYER_SYNCED_META.IDENTIFICATION_ID, identifier);
    },
    /**
     * Returns the player by the currently set identification strategy.
     *
     * @static
     * @param {(number | string)} id
     * @memberof Identifier
     */
    getPlayer(id: number | string): alt.Player {
        if (typeof id === 'string') {
            id = parseInt(id);
        }

        return alt.Player.all.find((target) => {
            if (!target || !target.valid || !target.data || !target.data._id) {
                return false;
            }

            if (strategy === 'account_id' && target.accountData.id === id) {
                return true;
            }

            if (strategy === 'character_id' && target.data.character_id === id) {
                return true;
            }

            if (target.id !== id) {
                return false;
            }

            return true;
        });
    },
    /**
     * Returns the current numerical identifier based on current strategy.
     *
     * @static
     * @param {alt.Player} player
     * @return {number}
     * @memberof Identifier
     */
    getIdByStrategy(player: alt.Player): number {
        const accountData = player.accountData;
        const data = player.data;

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
    },
};

/**
 * It takes a function name and a callback, and if the function exists in the exports object, it
 * overrides it with the callback
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the original function is called.
 * @returns The function is being returned.
 */
function override<Key extends keyof typeof IdentityRef>(functionName: Key, callback: typeof IdentityRef[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`systems/identifier.ts does not provide an export named ${functionName}`);
        return;
    }

    exports[functionName] = callback;
}

export const Identifier: typeof IdentityRef & { override?: typeof override } = {
    ...IdentityRef,
    override,
};

Identifier.init();
