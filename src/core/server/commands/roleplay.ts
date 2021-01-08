import * as alt from 'alt-server';
import { getDescription } from '../../shared/commands/commandList';
import { View_Events_Chat } from '../../shared/enums/views';
import { CommandsLocale } from '../../shared/locale/commands';
import { distance2d, getClosestTypes } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { addCommand } from '../systems/chat';
import { emitAll } from '../utility/emitHelper';
import { getPlayersByGridSpace } from '../utility/filters';

addCommand('b', handleCommandOOC);
addCommand('me', handleCommandMe);
addCommand('do', handleCommandDo);
addCommand('low', handleCommandLow);
addCommand('w', handleCommandWhisper);

function handleCommandOOC(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        player.send(getDescription('b'));
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
        player.send(getDescription('me'));
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
        player.send(getDescription('do'));
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
        player.send(getDescription('low'));
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
        player.send(getDescription('w'));
        return;
    }

    if (id === null) {
        player.send(getDescription('w'));
        return;
    }

    const players = [...alt.Player.all];
    const target = players.find((target) => target && id === target.id.toString());

    if (!target || !target.valid) {
        player.send(CommandsLocale.CANNOT_FIND_PLAYER);
        return;
    }

    if (distance2d(target.pos, player.pos) > DEFAULT_CONFIG.COMMAND_WHISPER_DISTANCE) {
        player.send(CommandsLocale.PLAYER_IS_TOO_FAR);
        return;
    }

    const fullMessage = args.join(' ');
    player.send(`${DEFAULT_CONFIG.CHAT_ROLEPLAY_WHISPER_COLOR}You whisper: '${fullMessage}' to ${target.data.name}`);
    target.send(`${DEFAULT_CONFIG.CHAT_ROLEPLAY_WHISPER_COLOR}${player.data.name} whispers: ${fullMessage}`);
}
