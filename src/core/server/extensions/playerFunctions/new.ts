import * as alt from 'alt-server';
import { Character, CharacterDefaults } from 'core/shared/interfaces/Character';
import { Database, getDatabase } from 'simplymongo';
import { Appearance } from 'core/shared/interfaces/Appearance';
import { CharacterInfo } from 'core/shared/interfaces/CharacterInfo';
import select from './select';
import { Vehicle } from 'core/shared/interfaces/Vehicle';

const db: Database = getDatabase();

/**
 * Create a new character with appearance data and info for this player.
 * @param {Partial<Appearance>} appearance
 * @param {Partial<CharacterInfo>} info
 * @param {string} name
 * @return {*}  {Promise<void>}
 * @memberof NewPrototype
 */
async function character(
    p: alt.Player,
    appearance: Partial<Appearance>,
    info: Partial<CharacterInfo>,
    name: string
): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.appearance = appearance;
    newDocument.info = info;
    newDocument.account_id = p.accountData._id;
    newDocument.name = name;

    const document = await db.insertData(newDocument, 'characters', true);
    document._id = document._id.toString(); // Re-cast id object as string.
    select.character(p, document);
}

export default {
    character
};
