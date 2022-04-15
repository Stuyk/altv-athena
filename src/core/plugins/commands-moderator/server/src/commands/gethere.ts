import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function handleGethereCmd(player: alt.Player, id: number) {
    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid || !id || target === player) {
        return;
    }

    Athena.player.safe.setPosition(target, player.pos.x + 1, player.pos.y, player.pos.z);
    Athena.player.emit.notification(player, `Successfully teleported ${target.data.name} to your position!`);
}
