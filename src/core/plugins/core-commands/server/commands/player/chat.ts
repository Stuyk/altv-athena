import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import ChatController from '../../../../../server/systems/chat';
import { View_Events_Chat } from '../../../../../shared/enums/views';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { distance2d } from '../../../../../shared/utility/vector';
import { RoleplayCmdsConfig } from '../../config/commandsConfig';

class ChatCommands {
    @command('do', LocaleController.get(LOCALE_KEYS.COMMAND_DO, '/do'), PERMISSIONS.NONE)
    private static handleDoCommand(player: alt.Player, ...args: any[]) {
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

    @command('low', LocaleController.get(LOCALE_KEYS.COMMAND_LOW, '/low'), PERMISSIONS.NONE)
    private static handleLowCommand(player: alt.Player, ...args: any[]) {
        if (args.length <= 0) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('low'));
            return;
        }

        const fullMessage = args.join(' ');
        const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_LOW_DISTANCE);

        alt.emitClient(
            closestPlayers,
            View_Events_Chat.Append,
            `${RoleplayCmdsConfig.CHAT_ROLEPLAY_LOW_COLOR}${player.data.name} ${fullMessage}`,
        );
    }

    @command('me', LocaleController.get(LOCALE_KEYS.COMMAND_ME, 'me'), PERMISSIONS.NONE)
    private static handleMeCommand(player: alt.Player, ...args: any[]) {
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

    @command('ooc', LocaleController.get(LOCALE_KEYS.COMMAND_OOC, '/b'), PERMISSIONS.NONE)
    static handleOocCommand(player: alt.Player, ...args: any[]) {
        if (args.length <= 0) {
            Athena.player.emit.message(player, Athena.controllers.chat.getDescription('b'));
            return;
        }
    
        const fullMessage = args.join(' ');
        const closestPlayers = Athena.player.get.playersByGridSpace(player, RoleplayCmdsConfig.COMMAND_OOC_DISTANCE);
    
        alt.emitClient(
            closestPlayers,
            View_Events_Chat.Append,
            `${RoleplayCmdsConfig.CHAT_ROLEPLAY_OOC_COLOR}${player.data.name}: (( ${fullMessage} ))`,
        );
    }

    @command(['whisper', 'w'], LocaleController.get(LOCALE_KEYS.COMMAND_WHISPER, '/w'), PERMISSIONS.NONE)
    private static handleWhisperCommand(player: alt.Player, id: string, ...args: any[]) {
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