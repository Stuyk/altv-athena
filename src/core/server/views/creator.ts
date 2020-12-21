import * as alt from 'alt-server';
import { View_Events_Creator } from '../../shared/enums/views';
import { Appearance } from '../../shared/interfaces/Appearance';
import { CharacterInfo } from '../../shared/interfaces/CharacterInfo';

alt.onClient(View_Events_Creator.Done, handleCreatorDone);
alt.onClient(View_Events_Creator.AwaitModel, handleAwaitModel);

/**
 * Called when a player pushes up Character Creator data.
 * @param  {alt.Player} player
 * @param  {Appearance} appearance
 */
function handleCreatorDone(player: alt.Player, appearance: Appearance, info: CharacterInfo) {
    if (!player.pendingCharacterEdit) {
        alt.log(`${player.name} | Attempted to edit a character when no edit was requested.`);
        return;
    }

    if (player.pendingNewCharacter) {
        player.pendingNewCharacter = false;
        player.createNewCharacter(appearance, info);
        return;
    }

    player.pendingCharacterEdit = false;
    player.updateDataByKeys(appearance, 'appearance');
    player.updateDataByKeys(info, 'info');
    player.updateAppearance();

    // Resync Position After Appearance for Interior Bug
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        player.safeSetPosition(player.pos.x, player.pos.y, player.pos.z);
    }, 500);
}

function handleAwaitModel(player, characterSex) {
    player.model = characterSex === 0 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
    player.pos = player.pos;
    alt.emitClient(player, View_Events_Creator.AwaitModel);
}
