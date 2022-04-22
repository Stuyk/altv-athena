import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { View_Events_Chat } from '../../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

class ChatCommands {
    @command('ac', '/ac <very_long_message> - Chat with other admins', PERMISSIONS.ADMIN)
    private static adminChatCommand(player: alt.Player, ...args): void {
        if (args.length <= 0) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('ac'));
            return;
        }

        const admins = Athena.player.get.playersByPermissionLevel([PERMISSIONS.ADMIN]);
        alt.emitClient(admins, View_Events_Chat.Append, `[AC] ${player.data.name}: ${args.join(' ')}`);
    }

    @command('apm', '/apm <ID> - Sends an administrative private message to the specified player.', PERMISSIONS.ADMIN)
    private static adminPrivateMessageCommand(player: alt.Player, id: string, ...args: string[]) {
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

    @command('broadcast', '/broadcast <very_long_message> - Broadcast to the whole server', PERMISSIONS.ADMIN)
    private static broadcastCommand(player: alt.Player, ...args) {
        if (args.length <= 0) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('broadcast'));
            return;
        }

        const validPlayers = [...alt.Player.all].filter((x) => x && x.valid && x.data);
        alt.emitClient(validPlayers, View_Events_Chat.Append, `[BROADCAST] ${player.data.name}: ${args.join(' ')}`);
    }

    @command('mc', '/mc', PERMISSIONS.MODERATOR | PERMISSIONS.ADMIN)
    private static moderatorChatCommand(player: alt.Player, ...args): void {
        if (args.length <= 0) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('mc'));
            return;
        }

        const modsAndAdmins = Athena.player.get.playersByPermissionLevel([PERMISSIONS.ADMIN, PERMISSIONS.MODERATOR]);
        alt.emitClient(modsAndAdmins, View_Events_Chat.Append, `[MC] ${player.data.name}: ${args.join(' ')}`);
    }
}
