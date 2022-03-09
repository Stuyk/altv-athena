import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
export function handleFreezeCmd(player: alt.Player, id: number) {
    const target = playerFuncs.get.findByUid(id);

    if (!target || !target.valid) {
        return;
    }
    playerFuncs.safe.setPosition(target, target.pos.x, target.pos.y, target.pos.z);
    playerFuncs.set.frozen(target, true);
    playerFuncs.emit.notification(player, `Froze ${target.data.name} successfully!`);
}
