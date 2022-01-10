import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/character';
import Database from '@stuyk/ezmongodb';
import { Appearance } from '../../../shared/interfaces/appearance';
import { CharacterInfo } from '../../../shared/interfaces/characterInfo';
import select from './select';
import { Collections } from '../../interface/iDatabaseCollections';
import { AgendaSystem } from '../../systems/agenda';

/**
 * Create a new character with appearance data and info for this player.
 * @param {Partial<Appearance>} appearance
 * @param {Partial<CharacterInfo>} info
 * @param {string} name
 * @return {*}  {Promise<void>}
 * @memberof NewPrototype
 */
async function character(
    player: alt.Player,
    appearance: Partial<Appearance>,
    info: Partial<CharacterInfo>,
    name: string,
): Promise<void> {
    const newDocument: Partial<Character> = { ...CharacterDefaults };
    newDocument.appearance = appearance;
    newDocument.info = info;
    newDocument.account_id = player.accountData._id;
    newDocument.name = name;

    const document = await Database.insertData(newDocument, Collections.Characters, true);
    document._id = document._id.toString(); // Re-cast id object as string.
}

export default {
    character,
};
