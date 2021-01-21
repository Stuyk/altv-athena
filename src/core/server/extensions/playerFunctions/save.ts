import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Character } from '../../../shared/interfaces/Character';

const db: Database = getDatabase();

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
    await db.updatePartialData(p.data._id, { [fieldName]: fieldValue }, 'characters');
}

/**
 * Update a partial object of data for the current character of this player.
 * @param {Partial<Character>} dataObject
 * @return {*}  {Promise<void>}
 * @memberof SavePrototype
 */
async function partial(p: alt.Player, dataObject: Partial<Character>): Promise<void> {
    await db.updatePartialData(p.data._id, { ...dataObject }, 'characters');
}

/**
 * Call to manually save character data like position, health, etc.
 * @return {*}  {Promise<void>}
 * @memberof SavePrototype
 */
async function onTick(p: alt.Player): Promise<void> {
    // Update Server Data First
    p.data.pos = p.pos;
    p.data.health = p.health;
    p.data.armour = p.armour;

    // Update Database
    saveField(p, 'pos', p.data.pos);
    saveField(p, 'health', p.data.health);
    saveField(p, 'armour', p.data.armour);
}

export default {
    field: saveField,
    partial,
    onTick
};
