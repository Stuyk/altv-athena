import * as alt from 'alt-server';
import { View_Events_Chat } from 'core/shared/enums/views';
import { Permissions } from 'core/shared/flags/permissions';
import { CommandsLocale } from 'core/shared/locale/commands';
import { distance2d } from 'core/shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { emitAll } from '../utility/emitHelper';
import { getPlayersByGridSpace } from '../utility/filters';

// Talk out of Character
ChatController.addCommand('b', '/b [message] - Speak out of character', Permissions.None, handleCommandOOC);

// Perform an Action
ChatController.addCommand(
    'me',
    '/me [describe what you are doing] - Roleplay an action',
    Permissions.None,
    handleCommandMe
);

// Describe an Action
ChatController.addCommand('do', '/do [describe an object] - Describe something', Permissions.None, handleCommandDo);

// Speak Low
ChatController.addCommand('low', '/low [quietly speak something]', Permissions.None, handleCommandLow);

// Whisper
ChatController.addCommand('w', '/w [player_id] [message] - Whisper', Permissions.None, handleCommandWhisper);
ChatController.addAliases('w', ['whisper']);

function handleCommandOOC(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('b'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getPlayersByGridSpace(player, DEFAULT_CONFIG.COMMAND_OOC_DISTANCE);

    emitAll(
        closestPlayers,
        View_Events_Chat.Append,
        `${DEFAULT_CONFIG.CHAT_ROLEPLAY_OOC_COLOR}${player.data.name}: (( ${fullMessage} ))`
    );
}

function handleCommandMe(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('me'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getPlayersByGridSpace(player, DEFAULT_CONFIG.COMMAND_ME_DISTANCE);

    emitAll(
        closestPlayers,
        View_Events_Chat.Append,
        `${DEFAULT_CONFIG.CHAT_ROLEPLAY_COLOR}${player.data.name} ${fullMessage}`
    );
}

function handleCommandDo(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('do'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getPlayersByGridSpace(player, DEFAULT_CONFIG.COMMAND_DO_DISTANCE);

    emitAll(
        closestPlayers,
        View_Events_Chat.Append,
        `${DEFAULT_CONFIG.CHAT_ROLEPLAY_COLOR}* ${fullMessage} ((${player.data.name}))`
    );
}

function handleCommandLow(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        playerFuncs.emit.message(player, ChatController.getDescription('low'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getPlayersByGridSpace(player, DEFAULT_CONFIG.COMMAND_LOW_DISTANCE);

    emitAll(
        closestPlayers,
        View_Events_Chat.Append,
        `${DEFAULT_CONFIG.CHAT_ROLEPLAY_LOW_COLOR}${player.data.name} ${fullMessage}`
    );
}

function handleCommandWhisper(player: alt.Player, id: string, ...args) {
    if (args.length <= 0) {
        return;
    }

    if (typeof id !== 'string') {
        playerFuncs.emit.message(player, ChatController.getDescription('w'));
        return;
    }

    if (id === null) {
        playerFuncs.emit.message(player, ChatController.getDescription('w'));
        return;
    }

    const players = [...alt.Player.all];
    const target = players.find((target) => target && id === target.id.toString());

    if (!target || !target.valid) {
        playerFuncs.emit.message(player, CommandsLocale.CANNOT_FIND_PLAYER);
        return;
    }

    if (distance2d(target.pos, player.pos) > DEFAULT_CONFIG.COMMAND_WHISPER_DISTANCE) {
        playerFuncs.emit.message(player, CommandsLocale.PLAYER_IS_TOO_FAR);
        return;
    }

    const fullMessage = args.join(' ');
    playerFuncs.emit.message(
        player,
        `${DEFAULT_CONFIG.CHAT_ROLEPLAY_WHISPER_COLOR}You whisper: '${fullMessage}' to ${target.data.name}`
    );

    playerFuncs.emit.message(
        target,
        `${DEFAULT_CONFIG.CHAT_ROLEPLAY_WHISPER_COLOR}${player.data.name} whispers: ${fullMessage}`
    );
}
