import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Character } from '../../../shared/interfaces/character';
import { Collections } from '../../interface/iDatabaseCollections';
import { Injections } from '../../systems/injections';
import { PlayerInjectionNames, PlayerSaveTickCallback } from '../../systems/injections/player';
import { StateManager } from '../../systems/stateManager';

/**
 * Save a specific field for the current character of this player.
 * player.data.cash = 25;
 * player.save().field('cash', player.data.cash);
 * @param {string} fieldName
 * @param {any} fieldValue
 * @return {Promise<void>}
 * @memberof SavePrototype
 */
async function saveField(p: alt.Player, fieldName: string, fieldValue: any): Promise<void> {
    alt.setTimeout(async () => {
        await Database.updatePartialData(p.data._id, { [fieldName]: fieldValue }, Collections.Characters);
    }, 0);
}

/**
 * Update a partial object of data for the current character of this player.
 * @param {Partial<Character>} dataObject
 * @return {Promise<void>}
 * @memberof SavePrototype
 */
async function partial(p: alt.Player, dataObject: Partial<Character>): Promise<void> {
    alt.setTimeout(async () => {
        await Database.updatePartialData(p.data._id, { ...dataObject }, Collections.Characters);
    }, 0);
}

/**
 * Call to manually save character data like position, health, etc.
 * Use an Injection to append data to the save-tick function.
 *
 * @return {Promise<void>}
 * @memberof SavePrototype
 */
async function onTick(player: alt.Player): Promise<void> {
    let injections = { pos: player.data.pos, health: player.data.health, armour: player.data.armour };

    const saveTickInjections = Injections.get<PlayerSaveTickCallback>(PlayerInjectionNames.PLAYER_SAVE_TICK);
    for (const callback of saveTickInjections) {
        try {
            injections = { ...injections, ...callback(player) };
        } catch (err) {
            console.warn(`Got Save Injection Error for Player: ${err}`);
            continue;
        }
    }

    StateManager.setBulk(player, injections);
}

export default {
    field: saveField,
    partial,
    onTick,
};
