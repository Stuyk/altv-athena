import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function handleFreezeCmd(player: alt.Player, id: number) {
    const target = Athena.player.get.findByUid(id);

    if (!target || !target.valid) {
        /* It's returning the function. */
        return;
    }
    Athena.player.safe.setPosition(target, target.pos.x, target.pos.y, target.pos.z);
    Athena.player.set.frozen(target, true);
    Athena.player.emit.notification(player, `Froze ${target.data.name} successfully!`);
}
