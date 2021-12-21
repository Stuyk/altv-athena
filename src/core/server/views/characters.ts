import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { View_Events_Characters, View_Events_Creator } from '../../shared/enums/views';
import { Character } from '../../shared/interfaces/Character';
import { Item } from '../../shared/interfaces/Item';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import './clothing';

alt.onClient(View_Events_Characters.Select, handleSelectCharacter);
alt.onClient(View_Events_Characters.New, handleNewCharacter);
alt.onClient(View_Events_Characters.Delete, handleDelete);

/**
 * Called when a player needs to go to character select.
 * @param  {Player} player
 */
export async function goToCharacterSelect(player: Player): Promise<void> {
    const characters: Array<Character> = await Database.fetchAllByField<Character>(
        'account_id',
        player.accountData._id,
        Collections.Characters,
    );

    player.pendingCharacterSelect = true;

    // No Characters Found
    if (characters.length <= 0) {
        handleNewCharacter(player);
        return;
    }

    // Fixes all character _id to string format.
    for (let i = 0; i < characters.length; i++) {
        characters[i]._id = characters[i]._id.toString();
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };

    player.currentCharacters = characters;
    player.visible = false;
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);

    alt.setTimeout(() => {
        alt.emitClient(
            player,
            View_Events_Characters.Show,
            characters,
            DEFAULT_CONFIG.CHARACTER_SELECT_POS,
            DEFAULT_CONFIG.CHARACTER_SELECT_ROT,
        );
    }, 1000);
}

/**
 * Called when a player selects a character by id.
 * @param  {Player} player
 * @param  {string} id
 */
export async function handleSelectCharacter(player: Player, id: string): Promise<void> {
    if (!id) {
        return;
    }

    if (!player.currentCharacters) {
        alt.logWarning(`[Athena] Failed to get characters for a player. Sending them to character select again.`);
        goToCharacterSelect(player);
        return;
    }

    const index = player.currentCharacters.findIndex((x) => `${x._id}` === `${id}`);
    if (index <= -1) {
        return;
    }

    if (!player.pendingCharacterSelect) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }

    player.pendingCharacterSelect = false;
    alt.emitClient(player, View_Events_Characters.Done);
    playerFuncs.select.character(player, player.currentCharacters[index]);
}

/**
 * Called when a player wants to delete one of their characters.
 * @param {Player} player
 */
async function handleDelete(player: Player, id: string): Promise<void> {
    if (!player.pendingCharacterSelect) {
        alt.log(`${player.name} | Attempted to delete a character when not asked to delete one.`);
        return;
    }

    const character_uid = id;
    await Database.deleteById(character_uid, Collections.Characters); // Remove Character Here

    // Refetch Characters
    const characters: Array<Character> = await Database.fetchAllByField<Character>(
        'account_id',
        player.accountData._id,
        Collections.Characters,
    );

    player.pendingCharacterSelect = true;

    // No Characters Found
    if (characters.length <= 0) {
        player.currentCharacters = [];
        handleNewCharacter(player);
        return;
    }

    // Fixes all character _id to string format.
    for (let i = 0; i < characters.length; i++) {
        characters[i]._id = characters[i]._id.toString();
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_SELECT_POS };
    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);

    player.currentCharacters = characters;
    alt.emitClient(player, View_Events_Characters.Show, characters);
}

/**
 * Called when a player who has characters wants to make a new one.
 * @param  {Player} player
 */
export function handleNewCharacter(player: Player): void {
    // Prevent more than 3 characters per account.
    if (player.currentCharacters && player.currentCharacters.length >= DEFAULT_CONFIG.PLAYER_MAX_CHARACTER_SLOTS) {
        alt.log(`${player.name} | Attempted to create a new character when max characters was exceeded.`);
        return;
    }

    let totalCharacters = 0;
    if (player.currentCharacters) {
        totalCharacters = player.currentCharacters.length;
    }

    if (!player.pendingCharacterSelect) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }

    player.pendingCharacterSelect = false;
    player.pendingCharacterEdit = true;
    player.pendingNewCharacter = true;
    player.visible = false;
    playerFuncs.set.frozen(player, true);
    playerFuncs.safe.setPosition(
        player,
        DEFAULT_CONFIG.CHARACTER_CREATOR_POS.x,
        DEFAULT_CONFIG.CHARACTER_CREATOR_POS.y,
        DEFAULT_CONFIG.CHARACTER_CREATOR_POS.z,
    );

    alt.emitClient(player, View_Events_Characters.Done);
    alt.setTimeout(() => {
        alt.emitClient(
            player,
            View_Events_Creator.Show,
            DEFAULT_CONFIG.CHARACTER_CREATOR_POS,
            DEFAULT_CONFIG.CHARACTER_SELECT_ROT,
            null,
            true,
            false,
            totalCharacters,
        ); // _oldCharacterData, _noDiscard, _noName
    }, 1000);
}

function update(player: alt.Player, id: string) {
    if (!player.currentCharacters) {
        player.kick('Something went wrong during selection...');
        return;
    }

    const index = player.currentCharacters.findIndex((x) => x._id === id);
    if (index <= -1) {
        goToCharacterSelect(player);
        return;
    }

    const character = player.currentCharacters[index];
    const isMale = character.appearance.sex === 1 ? true : false;

    player.model = isMale ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
    player.pos = player.pos;

    // Update Appearance

    // Update Equipment
    playerFuncs.sync.equipment(player, character.equipment as Array<Item>, isMale);
}
