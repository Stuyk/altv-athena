import * as alt from 'alt-client';
import * as native from 'natives';
import { Player_Status } from '../../shared/enums/player';

alt.onServer(Player_Status.SetFreeze, handleFreezePlayer);

/**
 * Freezes the player or unfreezes the player.
 * @param {boolean} value
 */
export function handleFreezePlayer(value: boolean): void {
    native.freezeEntityPosition(alt.Player.local.scriptID, value);
}
