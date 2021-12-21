import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.PLAYER_SET_FREEZE, handleFreezePlayer);

/**
 * Freezes the player or unfreezes the player.
 * @param {boolean} value
 */
export function handleFreezePlayer(value: boolean): void {
    native.freezeEntityPosition(alt.Player.local.scriptID, value);
}
