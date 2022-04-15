import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function handleGotoCmd(player: alt.Player, id: number) {
    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid || !id || target === player) {
        return;
    }

    Athena.player.safe.setPosition(player, target.pos.x + 1, target.pos.y, target.pos.z);
}
