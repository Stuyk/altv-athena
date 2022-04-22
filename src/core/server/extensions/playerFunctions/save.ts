import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Character } from '../../../shared/interfaces/character';
import { Collections } from '../../interface/iDatabaseCollections';

const SaveInjections: Array<(vehicle: alt.Player) => { [key: string]: any }> = [];

/**
 * Lets you create an injection into the default save function.
 *
 * What that means is you can return specific data from a callback as an object.
 *
 * That object will then be appended to the data to save for the player.
 *
 * Keep in mind that this is in the 'tick' function for players.
 *
 * Which means it updates pretty often.
 *
 * Example:
 * ```ts
 * function savePlayerArmour(player: alt.Player) {
 *     return { armour: player.armour };
 * }
 *
 * Athena.player.save.addSaveInjection(savePlayerArmour)
 * ```
 * @static
 * @param {(vehicle: alt.Vehicle) => { [key: string]: any }} callback
 * @memberof VehicleFuncs
 */
function addSaveInjection(callback: (player: alt.Player) => { [key: string]: any }) {
    SaveInjections.push(callback);
}

/**
 * Save a specific field for the current character of this player.
 * player.data.cash = 25;
 * player.save().field('cash', player.data.cash);
 * @param {string} fieldName
 * @param {*} fieldValue
 * @return {*}  {Promise<void>}
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
 * @return {*}  {Promise<void>}
 * @memberof SavePrototype
 */
async function onTick(player: alt.Player): Promise<void> {
    // Update Server Data First
    player.data.pos = player.pos;
    player.data.health = player.health;
    player.data.armour = player.armour;

    let injections = { pos: player.data.pos, health: player.data.health, armour: player.data.armour };
    for (let i = 0; i < SaveInjections.length; i++) {
        try {
            injections = { ...injections, ...SaveInjections[i](player) };
        } catch (err) {
            console.warn(`Got Save Injection Error for Player: ${err}`);
            continue;
        }
    }

    partial(player, injections);
}

export default {
    addSaveInjection,
    field: saveField,
    partial,
    onTick,
};
