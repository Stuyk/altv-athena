import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { getPlayersByPermissionLevel } from '../utility/filters';
import { Permissions } from '../../shared/flags/permissions';
import { emitAll } from '../utility/emitHelper';
import { View_Events_Chat } from '../../shared/enums/views';
import { playerFuncs } from '../extensions/Player';

ChatController.addCommand(
    'broadcast',
    '/broadcast [message] - Announce server-wide',
    Permissions.Admin,
    handleBroadcast
);
ChatController.addCommand('ac', '/ac [message] - Speak to other Admins', Permissions.Admin, handleAdminChat);
ChatController.addCommand(
    'mc',
    '/mc [message] - Speak to other Admins and Moderators',
    Permissions.Moderator | Permissions.Admin,
    handleModeratorChat
);

function handleAdminChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('ac'));
        return;
    }

    const admins = getPlayersByPermissionLevel([Permissions.Admin]);
    emitAll(admins, View_Events_Chat.Append, `[AC] ${player.data.name}: ${args.join(' ')}`);
}

function handleModeratorChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('mc'));
        return;
    }

    const modsAndAdmins = getPlayersByPermissionLevel([Permissions.Admin, Permissions.Moderator]);
    emitAll(modsAndAdmins, View_Events_Chat.Append, `[MC] ${player.data.name}: ${args.join(' ')}`);
}

function handleBroadcast(player: alt.Player, ...args) {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('broadcast'));
        return;
    }

    emitAll(alt.Player.all, View_Events_Chat.Append, `[Broadcast] ${player.data.name}: ${args.join(' ')}`);
}
