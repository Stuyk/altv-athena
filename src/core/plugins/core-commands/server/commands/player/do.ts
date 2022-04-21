import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import ChatController from '../../../../../server/systems/chat';
import { View_Events_Chat } from '../../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { RoleplayCmdsConfig } from '../../config';

class DoCommand {
    @command('do', LocaleController.get(LOCALE_KEYS.COMMAND_DO, '/do'), PERMISSIONS.NONE)
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
