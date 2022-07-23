import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Character } from '../../../shared/interfaces/character';
import { Collections } from '../../interface/iDatabaseCollections';
import { Injections } from '../../systems/injections';
import { PlayerInjectionNames, PlayerSaveTickCallback } from '../../systems/injections/player';
import { StateManager } from '../../systems/stateManager';
import { distance2d } from '../../../shared/utility/vector';

const Save = {
    /**
     * Save a specific field for the current character of this player.
     * player.data.cash = 25;
     * player.save().field('cash', player.data.cash);
     * @param {string} fieldName
     * @param {any} fieldValue
     * @return {Promise<void>}
     * @memberof SavePrototype
     */
    async save(p: alt.Player, fieldName: string, fieldValue: any): Promise<void> {
        alt.setTimeout(async () => {
            await Database.updatePartialData(p.data._id, { [fieldName]: fieldValue }, Collections.Characters);
        }, 0);
    },

    /**
     * Update a partial object of data for the current character of this player.
     * @param {Partial<Character>} dataObject
     * @return {Promise<void>}
     * @memberof SavePrototype
     */
    async partial(p: alt.Player, dataObject: Partial<Character>): Promise<void> {
        alt.setTimeout(async () => {
            await Database.updatePartialData(p.data._id, { ...dataObject }, Collections.Characters);
        }, 0);
    },

    /**
     * Call to manually save character data like position, health, etc.
     * Use an Injection to append data to the save-tick function.
     *
     * @return {Promise<void>}
     * @memberof SavePrototype
     */
    async onTick(player: alt.Player): Promise<void> {
        let injections: Partial<Character> = {};

        if (!player || !player.valid || !player.data) {
            return;
        }

        const dist = distance2d(player.pos, player.data.pos as alt.Vector2);

        if (player && player.pos && dist >= 1) {
            injections.pos = player.pos;
        }

        if (player.health !== player.data.health) {
            injections.health = player.health;
        }

        if (player.armour !== player.data.armour) {
            injections.armour = player.armour;
        }

        const saveTickInjections = Injections.get<PlayerSaveTickCallback>(PlayerInjectionNames.PLAYER_SAVE_TICK);
        for (const callback of saveTickInjections) {
            try {
                injections = { ...injections, ...callback(player) };
            } catch (err) {
                console.warn(`Got Save Injection Error for Player: ${err}`);
                continue;
            }
        }

        if (Object.keys(injections).length <= 0) {
            return;
        }

        StateManager.setBulk(player, injections, true);
    },
};

/**
 * It allows you to override a function in the Save module
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Save>(functionName: Key, callback: typeof Save[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`Athena.player.save does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

const exports: typeof Save & { override?: typeof override } = {
    ...Save,
    override,
};

export default exports;
