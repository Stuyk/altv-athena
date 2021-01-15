import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';
import { Database, getDatabase } from 'simplymongo';
import { Appearance } from '../../../shared/interfaces/Appearance';
import { CharacterInfo } from '../../../shared/interfaces/CharacterInfo';

const db: Database = getDatabase();

export interface NewDataPrototype {
    character(appearance: Partial<Appearance>, info: Partial<CharacterInfo>, name: string): Promise<void>;
}

export function bind(): NewDataPrototype {
    const _this = this;
    _this.character = character;
    return _this;
}

/**
 * Create a new character with appearance data and info for this player.
 * @param {Partial<Appearance>} appearance
 * @param {Partial<CharacterInfo>} info
 * @param {string} name
 * @return {*}  {Promise<void>}
 * @memberof NewPrototype
 */
async function character(appearance: Partial<Appearance>, info: Partial<CharacterInfo>, name: string): Promise<void> {
    const p: alt.Player = (this as unknown) as alt.Player;
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.appearance = appearance;
    newDocument.info = info;
    newDocument.account_id = p.accountData._id;
    newDocument.name = name;

    const document = await db.insertData(newDocument, 'characters', true);
    document._id = document._id.toString(); // Re-cast id object as string.
    p.select().character(document);
}
