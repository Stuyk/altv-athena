import * as alt from 'alt-server';
import { playerFuncs } from '../extensions/Player';

alt.on('playerDeath', handleDeath);

function handleDeath(player: alt.Player, killer: alt.Entity, weaponHash: any): void {
    if (!player || !player.valid) {
        return;
    }

    if (!killer || !(killer instanceof alt.Player) || !killer.valid) {
      return
    }

    playerFuncs.set.dead(player, killer as alt.Player, weaponHash);
}
