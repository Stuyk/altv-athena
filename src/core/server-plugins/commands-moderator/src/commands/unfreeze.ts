import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
export function handleUnfreezeCmd(player: alt.Player, id: number) {
    const target = playerFuncs.get.findByUid(id);

    if (!target || !target.valid) {
        return;
    }

    playerFuncs.set.frozen(target, false);
    playerFuncs.emit.notification(player, `Unfroze ${target.data.name} successfully!`);
}
