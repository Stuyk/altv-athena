import * as alt from 'alt-server';
import { IAppearance } from '../../shared/interfaces/IAppearance';

alt.onClient('creator:Done', handleCreatorDone);

function handleCreatorDone(player: alt.Player, appearance: IAppearance) {
    if (!player.pendingCharacterEdit) {
        const log = `Attempted to edit character when no edit was requested.`;
        alt.log(`${player.name} - ${log}`);
        player.kick(log);
        return;
    }

    player.pendingCharacterEdit = false;
}
