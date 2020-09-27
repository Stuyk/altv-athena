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

    if (player.pendingNewCharacter) {
        player.pendingNewCharacter = false;
        player.createNewCharacter(appearance);
        return;
    }

    player.pendingCharacterEdit = false;
    player.updateDataByKeys(appearance, 'appearance');
    player.updateAppearance();

    // Resync Position After Appearance for Interior Bug
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        player.safeSetPosition(player.pos.x, player.pos.y, player.pos.z);
    }, 500);
}
