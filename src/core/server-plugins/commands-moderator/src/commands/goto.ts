import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
export function handleGotoCmd(player: alt.Player, id: number) {
    const target = playerFuncs.get.findByUid(id);
    if (!target || !target.valid || !id || target === player) {
        return;
    }

    playerFuncs.safe.setPosition(player, target.pos.x + 1, target.pos.y, target.pos.z);
}
