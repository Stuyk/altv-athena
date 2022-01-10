import * as alt from 'alt-server';
import { View_Events_Creator } from '../../shared/enums/views';
import { Appearance } from '../../shared/interfaces/appearance';
import { CharacterInfo } from '../../shared/interfaces/characterInfo';
import { CharacterSelectFunctions, handleNewCharacter } from './characters';
import Database from '@stuyk/ezmongodb';
import { Character } from '../../shared/interfaces/character';
import { playerFuncs } from '../extensions/extPlayer';
import { Collections } from '../interface/iDatabaseCollections';

alt.onClient(View_Events_Creator.Done, handleCreatorDone);
alt.onClient(View_Events_Creator.AwaitModel, handleAwaitModel);
alt.onClient(View_Events_Creator.AwaitName, handleAwaitNameValid);

/**
 * Called when a player pushes up Character Creator data.
 * @param  {alt.Player} player
 * @param  {Appearance} appearance
 */
async function handleCreatorDone(
    player: alt.Player,
    appearance: Appearance,
    info: CharacterInfo,
    name: string,
): Promise<void> {
    if (!player.pendingCharacterEdit) {
        alt.log(`${player.name} | Attempted to edit a character when no edit was requested.`);
        return;
    }

    if (!info) {
        player.pendingNewCharacter = false;
        player.pendingCharacterEdit = false;

        if (player.currentCharacters && player.currentCharacters.length >= 1) {
            CharacterSelectFunctions.show(player);
            return;
        }

        alt.log(`${player.name} | Has zero characters. Sending to character editor.`);
        player.pendingNewCharacter = false;
        player.pendingCharacterEdit = false;
        player.pendingCharacterSelect = true;
        handleNewCharacter(player);
        return;
    }

    if (player.pendingNewCharacter) {
        player.pendingNewCharacter = false;
        await playerFuncs.createNew.character(player, appearance, info, name);
        CharacterSelectFunctions.show(player);
        return;
    }

    player.visible = false;
    player.pendingCharacterEdit = false;
    playerFuncs.dataUpdater.updateByKeys(player, appearance, 'appearance');
    playerFuncs.dataUpdater.updateByKeys(player, info, 'info');
    playerFuncs.sync.appearance(player, appearance);

    // Resync Position After Appearance for Interior Bug
    alt.setTimeout(() => {
        if (!player || !player.valid) {
            return;
        }

        playerFuncs.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
    }, 500);
}

function handleAwaitModel(player: alt.Player, characterSex: number, shouldTPose: boolean): void {
    player.model = characterSex === 0 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
    player.pos = player.pos;
    alt.emitClient(player, View_Events_Creator.AwaitModel, shouldTPose);
}

async function handleAwaitNameValid(player: alt.Player, name: string): Promise<void> {
    const result = await Database.fetchData<Character>('name', name, Collections.Characters);

    if (!result) {
        alt.emitClient(player, View_Events_Creator.AwaitName, true); // Yes the name is available.
        return;
    }

    alt.emitClient(player, View_Events_Creator.AwaitName, false); // No the name is not available.
}
