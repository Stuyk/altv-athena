import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { View_Events_Chat } from '../../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { RoleplayCmdsConfig } from '../../config';

class MeCommand {
    @command('me', LocaleController.get(LOCALE_KEYS.COMMAND_ME, 'me'), PERMISSIONS.NONE)
    private static handleCommand(player: alt.Player, ...args: any[]) {
        if (args.length <= 0) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('me'));
            return;
        }
    
        const fullMessage = args.join(' ');
        const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_ME_DISTANCE);
    
        alt.emitClient(
            closestPlayers,
            View_Events_Chat.Append,
            `${RoleplayCmdsConfig.CHAT_ROLEPLAY_COLOR}${player.data.name} ${fullMessage}`,
        );
    }
}