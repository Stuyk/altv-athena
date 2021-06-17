import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';
import Database from '@stuyk/ezmongodb';
import { Appearance } from '../../../shared/interfaces/Appearance';
import { CharacterInfo } from '../../../shared/interfaces/CharacterInfo';
import select from './select';
import { Collections } from '../../interface/DatabaseCollections';

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

    const document = await Database.insertData(newDocument, Collections.Characters, true);
    document._id = document._id.toString(); // Re-cast id object as string.
    select.character(p, document);
}

export default {
    character
};
