import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { ICharacter } from '../../shared/interfaces/ICharacter';
import * as sm from 'simplymongo';

const db: sm.Database = sm.getDatabase();

alt.onClient('characters:Select', handleSelectCharacter);
alt.onClient('characters:New', handleNewCharacter);

/**
 * Called when a player needs to go to character select.
 * @param  {Player} player
 */
export async function goToCharacterSelect(player: Player) {
    const characters: Array<ICharacter> = await db.fetchAllByField<ICharacter>(
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

    player.currentCharacters = characters;
    player.safeSetPosition(202.10037231445312, -1007.5400390625, -99.00003051757812);
    player.emit('characters:Show', characters);
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
        const log = `Attempted to select character when no select was requested.`;
        alt.log(`${player.name} - ${log}`);
        player.kick(log);
        return;
    }

    player.pendingCharacterSelect = false;
    player.emit('characters:Done');
    player.selectCharacter(player.currentCharacters[index]);
}

/**
 * Called when a player who has characters wants to make a new one.
 * @param  {Player} player
 */
function handleNewCharacter(player: Player) {
    // Prevent more than 3 characters per account.
    if (player.currentCharacters && player.currentCharacters.length >= 3) {
        return;
    }

    if (!player.pendingCharacterSelect) {
        const log = `Attempted to select character when no select was requested.`;
        alt.log(`${player.name} - ${log}`);
        player.kick(log);
        return;
    }

    player.emit('characters:Done');
    player.pendingCharacterSelect = false;
    player.pendingCharacterEdit = true;
    player.pendingNewCharacter = true;
    player.safeSetPosition(202.10037231445312, -1007.5400390625, -99.00003051757812);
    player.emit('creator:Show', null, true, false); // _oldCharacterData, _noDiscard, _noName
}
