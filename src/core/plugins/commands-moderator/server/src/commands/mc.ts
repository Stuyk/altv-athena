import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { View_Events_Chat } from '../../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

export function handleModeratorChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        Athena.player.emit.message(player, Athena.controllers.chat.getDescription('mc'));
        return;
    }

    const modsAndAdmins = Athena.player.get.playersByPermissionLevel([PERMISSIONS.ADMIN, PERMISSIONS.MODERATOR]);
    alt.emitClient(modsAndAdmins, View_Events_Chat.Append, `[MC] ${player.data.name}: ${args.join(' ')}`);
}
