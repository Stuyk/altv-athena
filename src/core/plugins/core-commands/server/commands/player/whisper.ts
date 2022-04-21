import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import ChatController from '../../../../../server/systems/chat';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { distance2d } from '../../../../../shared/utility/vector';
import { RoleplayCmdsConfig } from '../../config';

class WhisperCommand {
    @command(['whisper', 'w'], LocaleController.get(LOCALE_KEYS.COMMAND_WHISPER, '/w'), PERMISSIONS.NONE)
    private static handleCommand(player: alt.Player, id: string, ...args: any[]) {
        if (args.length <= 0) {
            return;
        }
    
        if (typeof id !== 'string') {
            Athena.player.emit.message(player, ChatController.getDescription('w'));
            return;
        }
    
        if (id === null || id === undefined) {
            Athena.player.emit.message(player, ChatController.getDescription('w'));
            return;
        }
    
        const target = Athena.player.get.findByUid(id);
        if (!target || !target.valid) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }
    
        if (distance2d(target.pos, player.pos) > RoleplayCmdsConfig.COMMAND_WHISPER_DISTANCE) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.PLAYER_IS_TOO_FAR));
            return;
        }
    
        const fullMessage = args.join(' ');
        Athena.player.emit.message(
            player,
            `${RoleplayCmdsConfig.CHAT_ROLEPLAY_WHISPER_COLOR}You whisper: '${fullMessage}' to ${target.data.name}`,
        );
    
        Athena.player.emit.message(
            target,
            `${RoleplayCmdsConfig.CHAT_ROLEPLAY_WHISPER_COLOR}${player.data.name} whispers: ${fullMessage}`,
        );
    }
}