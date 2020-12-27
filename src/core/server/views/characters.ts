import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { View_Events_Characters, View_Events_Creator } from '../../shared/enums/views';
import { DEFAULT_CONFIG } from '../athena/main';
import * as sm from 'simplymongo';

const db: sm.Database = sm.getDatabase();

alt.onClient(View_Events_Characters.Select, handleSelectCharacter);
alt.onClient(View_Events_Characters.New, handleNewCharacter);
alt.onClient(View_Events_Characters.Delete, handleDelete);

/**
 * Called when a player needs to go to character select.
 * @param  {Player} player
 */
export async function goToCharacterSelect(player: Player) {
    const characters: Array<Character> = await db.fetchAllByField<Character>(
        'account_id',
        player.account,
        'characters'
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
    player.rot = { ...DEFAULT_CONFIG.CHARACTER_SELECT_ROT };
    player.safeSetPosition(pos.x, pos.y, pos.z);
    player.emit(View_Events_Characters.Show, characters);
}

/**
 * Called when a player selects a character by id.
 * @param  {Player} player
 * @param  {string} id
 */
export async function handleSelectCharacter(player: Player, id: string) {
    if (!id) {
        return;
    }

    const index = player.currentCharacters.findIndex((x) => x._id.toString() === id);
    if (index <= -1) {
        return;
    }

    if (!player.pendingCharacterSelect) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }

    player.pendingCharacterSelect = false;

    player.emit(View_Events_Characters.Done);
    player.selectCharacter(player.currentCharacters[index]);
}

/**
 * Called when a player wants to delete one of their characters.
 * @param {Player} player
 */
async function handleDelete(player: Player, id: string) {
    if (!player.pendingCharacterSelect) {
        alt.log(`${player.name} | Attempted to delete a character when not asked to delete one.`);
        return;
    }

    const character_uid = id;
    await db.deleteById(character_uid, 'characters'); // Remove Character Here

    // Refetch Characters
    const characters: Array<Character> = await db.fetchAllByField<Character>(
        'account_id',
        player.account,
        'characters'
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
    player.safeSetPosition(pos.x, pos.y, pos.z);

    player.currentCharacters = characters;
    player.emit(View_Events_Characters.Show, characters);
}

/**
 * Called when a player who has characters wants to make a new one.
 * @param  {Player} player
 */
export function handleNewCharacter(player: Player) {
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

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    player.pendingCharacterSelect = false;
    player.pendingCharacterEdit = true;
    player.pendingNewCharacter = true;

    player.rot = { ...DEFAULT_CONFIG.CHARACTER_SELECT_ROT };
    player.safeSetPosition(pos.x, pos.y, pos.z);
    player.emit(View_Events_Characters.Done);
    player.emit(View_Events_Creator.Show, null, true, false, totalCharacters); // _oldCharacterData, _noDiscard, _noName
}
