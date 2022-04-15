import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { View_Events_Chat } from '../../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

export function handleAdminChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        Athena.player.emit.message(player, Athena.controllers.chat.getDescription('ac'));
        return;
    }

    const admins = Athena.player.get.playersByPermissionLevel([PERMISSIONS.ADMIN]);
    alt.emitClient(admins, View_Events_Chat.Append, `[AC] ${player.data.name}: ${args.join(' ')}`);
}
