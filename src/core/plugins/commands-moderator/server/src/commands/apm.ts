import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function handleApmCmd(player: alt.Player, id: string, ...args: string[]) {
    const target = Athena.player.get.findByUid(id);
    if (!player || !player.valid || !target || !target.valid) {
        return;
    }

    if (!args || args.length <= 0) {
        Athena.player.emit.message(player, `Must specify what to send after in-game id.`);
        return;
    }

    let msg = `{FF0000}[APM] ${player.data.name}: ${args.join(' ')}`;
    Athena.player.emit.message(player, msg);
    Athena.player.emit.message(target, msg);
}
