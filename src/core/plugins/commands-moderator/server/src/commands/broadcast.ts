import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { View_Events_Chat } from '../../../../../shared/enums/views';

export function handleBroadcast(player: alt.Player, ...args) {
    if (args.length <= 0) {
        Athena.player.emit.message(player, Athena.controllers.chat.getDescription('broadcast'));
        return;
    }

    const validPlayers = [...alt.Player.all].filter((x) => x && x.valid && x.data);
    alt.emitClient(validPlayers, View_Events_Chat.Append, `[BROADCAST] ${player.data.name}: ${args.join(' ')}`);
}
