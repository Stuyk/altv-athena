import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/Player';

alt.on('playerDeath', handleDeath);

function handleDeath(player: alt.Player, killer: alt.Player, weaponHash: any): void {
    if (!player || !player.valid) {
        return;
    }

    playerFuncs.set.dead(player, killer, weaponHash);
}
