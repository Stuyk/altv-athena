import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
export function handleApmCmd(player: alt.Player, id: string, ...args: string[]) {
    const target = playerFuncs.get.findByUid(id);
    if (!player || !player.valid || !target || !target.valid) {
        return;
    }

    if (!args || args.length <= 0) {
        playerFuncs.emit.message(player, `Must specify what to send after in-game id.`);
        return;
    }

    let msg = `{FF0000}[APM] ${player.data.name}: ${args.join(' ')}`;
    playerFuncs.emit.message(player, msg);
    playerFuncs.emit.message(target, msg);
}
