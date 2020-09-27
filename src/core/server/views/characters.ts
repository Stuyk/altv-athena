import * as alt from 'alt-server';
import { Player } from 'alt-server';
import { ICharacter } from '../interface/ICharacter';
import * as sm from 'simplymongo';

const db: sm.Database = sm.getDatabase();

export async function goToCharacterSelect(player: Player) {
    const characters: Array<ICharacter> = await db.fetchAllByField('account_id', player.account, 'characters');

    // No Characters Found
    if (characters.length <= 0) {
        player.pendingCharacterEdit = true;
        player.pendingNewCharacter = true;
        player.safeSetPosition(197.8153, -1002.293, -99.65749);
        player.emit('creator:Show', null, true, false); // _oldCharacterData, _noDiscard, _noName
        return;
    }

    player.pendingCharacterSelect = true;
    player.currentCharacters = characters;
    player.emit('characters:Show', characters);

    selectCharacter(player, 0);
}

export async function selectCharacter(player: Player, index: number) {
    if (!player.pendingCharacterSelect) {
        const log = `Attempted to select character when no select was requested.`;
        alt.log(`${player.name} - ${log}`);
        player.kick(log);
        return;
    }

    player.pendingCharacterSelect = false;
    player.selectCharacter(player.currentCharacters[index]);
}
