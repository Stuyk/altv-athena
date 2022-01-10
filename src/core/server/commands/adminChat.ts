import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { getPlayersByPermissionLevel } from '../utility/filters';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { emitAll } from '../utility/emitHelper';
import { View_Events_Chat } from '../../shared/enums/views';
import { playerFuncs } from '../extensions/extPlayer';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

ChatController.addCommand(
    'broadcast',
    LocaleController.get(LOCALE_KEYS.COMMAND_BROADCAST, '/broadcast'),
    PERMISSIONS.ADMIN,
    handleBroadcast,
);
ChatController.addCommand(
    'ac',
    LocaleController.get(LOCALE_KEYS.COMMAND_ADMIN_CHAT, '/ac'),
    PERMISSIONS.ADMIN,
    handleAdminChat,
);

ChatController.addCommand(
    'mc',
    LocaleController.get(LOCALE_KEYS.COMMAND_MOD_CHAT, '/mc'),
    PERMISSIONS.MODERATOR | PERMISSIONS.ADMIN,
    handleModeratorChat,
);

function handleAdminChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('ac'));
        return;
    }

    const admins = getPlayersByPermissionLevel([PERMISSIONS.ADMIN]);
    emitAll(admins, View_Events_Chat.Append, `[AC] ${player.data.name}: ${args.join(' ')}`);
}

function handleModeratorChat(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('mc'));
        return;
    }

    const modsAndAdmins = getPlayersByPermissionLevel([PERMISSIONS.ADMIN, PERMISSIONS.MODERATOR]);
    emitAll(modsAndAdmins, View_Events_Chat.Append, `[MC] ${player.data.name}: ${args.join(' ')}`);
}

function handleBroadcast(player: alt.Player, ...args) {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('broadcast'));
        return;
    }

    emitAll(
        alt.Player.all,
        View_Events_Chat.Append,
        `[${LocaleController.get(LOCALE_KEYS.LABEL_BROADCAST)}] ${player.data.name}: ${args.join(' ')}`,
    );
}
