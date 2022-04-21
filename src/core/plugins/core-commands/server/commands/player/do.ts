import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import ChatController from '../../../../../server/systems/chat';
import { View_Events_Chat } from '../../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { RoleplayCmdsConfig } from '../../config';

class DoCommand {
    @command('do', ChatController.getDescription('do'), PERMISSIONS.NONE)
    private static handleCommand(player: alt.Player, ...args: any[]) {
        if (args.length <= 0) {
            Athena.player.emit.message(player, ChatController.getDescription('do'));
            return;
        }

        const fullMessage = args.join(' ');
        const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_DO_DISTANCE);

        alt.emitClient(
            closestPlayers,
            View_Events_Chat.Append,
            `${RoleplayCmdsConfig.CHAT_ROLEPLAY_COLOR}* ${fullMessage} ((${player.data.name}))`,
        );
    }
}
