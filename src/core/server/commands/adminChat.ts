import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';
import { getDescription } from '../../shared/commands/commandList';
import { getPlayersByPermissionLevel } from '../utility/filters';
import { Permissions } from '../../shared/enums/permissions';
import { emitAll } from '../utility/emitHelper';
import { View_Events_Chat } from '../../shared/enums/views';

addCommand('broadcast', handleBroadcast);
addCommand('ac', handleAdminChat);
addCommand('mc', handleModeratorChat);

function handleAdminChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        player.send(getDescription('ac'));
        return;
    }

    const admins = getPlayersByPermissionLevel([Permissions.Admin]);
    emitAll(admins, View_Events_Chat.Append, `[AC] ${player.data.name}: ${args.join(' ')}`);
}

function handleModeratorChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        player.send(getDescription('mc'));
        return;
    }

    const modsAndAdmins = getPlayersByPermissionLevel([Permissions.Admin, Permissions.Moderator]);
    emitAll(modsAndAdmins, View_Events_Chat.Append, `[MC] ${player.data.name}: ${args.join(' ')}`);
}

function handleBroadcast(player: alt.Player, ...args) {
    if (args.length <= 0) {
        player.send(getDescription('broadcast'));
        return;
    }

    emitAll(alt.Player.all, View_Events_Chat.Append, `[Broadcast] ${player.data.name}: ${args.join(' ')}`);
}
