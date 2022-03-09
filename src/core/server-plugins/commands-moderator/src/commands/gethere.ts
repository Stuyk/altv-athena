import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
export function handleGethereCmd(player: alt.Player, id: number) {
    const target = playerFuncs.get.findByUid(id);
    if (!target || !target.valid || !id || target === player) {
        return;
    }

    playerFuncs.safe.setPosition(target, player.pos.x + 1, player.pos.y, player.pos.z);
    playerFuncs.emit.notification(player, `Successfully teleported ${target.data.name} to your position!`);
}
