import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import * as sm from 'simplymongo';
import { View_Events_Characters, View_Events_Creator } from '../../shared/enums/views';
import { DEFAULT_CONFIG } from '../athena/main';

const db: sm.Database = sm.getDatabase();

alt.onClient(View_Events_Characters.Select, handleSelectCharacter);
alt.onClient(View_Events_Characters.New, handleNewCharacter);

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
 * Called when a player who has characters wants to make a new one.
 * @param  {Player} player
 */
function handleNewCharacter(player: Player) {
    // Prevent more than 3 characters per account.
    if (player.currentCharacters && player.currentCharacters.length >= 3) {
        alt.log(`${player.name} | Attempted to create a new character when max characters was exceeded.`);
        return;
    }

    if (!player.pendingCharacterSelect) {
        alt.log(`${player.name} | Attempted to select a character when not asked to select one.`);
        return;
    }

    const pos = { ...DEFAULT_CONFIG.CHARACTER_CREATOR_POS };

    player.pendingCharacterSelect = false;
    player.pendingCharacterEdit = true;
    player.pendingNewCharacter = true;

    player.safeSetPosition(pos.x, pos.y, pos.z);
    player.emit(View_Events_Characters.Done);
    player.emit(View_Events_Creator.Show, null, true, false); // _oldCharacterData, _noDiscard, _noName
}
