import { Player } from 'alt-server';
import { ICharacter } from '../interface/ICharacter';
import * as sm from 'simplymongo';

const db: sm.Database = sm.getDatabase();

export async function goToCharacterSelect(player: Player) {
    const characters: Array<ICharacter> = await db.fetchAllByField('account_id', player.account, 'characters');

    // No Characters Found
    if (characters.length <= 0) {
        player.pendingCharacterEdit = true;
        player.safeSetPosition(197.8153, -1002.293, -99.65749);
        player.emit('creator:Show');
        return;
    }

    player.emit('characters:Show', characters);
}
