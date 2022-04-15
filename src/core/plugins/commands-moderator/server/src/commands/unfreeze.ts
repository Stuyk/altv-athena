import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function handleUnfreezeCmd(player: alt.Player, id: number) {
    const target = Athena.player.get.findByUid(id);

    if (!target || !target.valid) {
        return;
    }

    Athena.player.set.frozen(target, false);
    Athena.player.emit.notification(player, `Unfroze ${target.data.name} successfully!`);
}
