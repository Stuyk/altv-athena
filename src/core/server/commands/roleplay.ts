import * as alt from 'alt-server';
import { getDescription } from '../../shared/commands/commandList';
import { View_Events_Chat } from '../../shared/enums/views';
import { distance2d, getClosestTypes } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { addCommand } from '../systems/chat';
import { emitAll } from '../utility/emitHelper';

const rpc = `{C39ADD}`; // Roleplay Color
const lowc = `{d3d3d3}`; // Low Color
const wc = `{e6e6ce}`; // Whisper Color

addCommand('me', handleCommandMe);
addCommand('do', handleCommandDo);
addCommand('low', handleCommandLow);
addCommand('w', handleCommandWhisper);

function handleCommandMe(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        player.send(getDescription('me'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getClosestTypes<alt.Player>(player.pos, alt.Player.all, DEFAULT_CONFIG.COMMAND_ME_DISTANCE, [
        'discord'
    ]);

    emitAll(closestPlayers, View_Events_Chat.Append, `${rpc}${player.data.name} ${fullMessage}`);
}

function handleCommandDo(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        player.send(getDescription('do'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getClosestTypes<alt.Player>(player.pos, alt.Player.all, DEFAULT_CONFIG.COMMAND_DO_DISTANCE, [
        'discord'
    ]);

    emitAll(closestPlayers, View_Events_Chat.Append, `${rpc}* ${fullMessage} ((${player.data.name}))`);
}

function handleCommandLow(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        player.send(getDescription('low'));
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getClosestTypes<alt.Player>(
        player.pos,
        alt.Player.all,
        DEFAULT_CONFIG.COMMAND_LOW_DISTANCE,
        ['discord']
    );

    emitAll(closestPlayers, View_Events_Chat.Append, `${lowc}${player.data.name} ${fullMessage}`);
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
        player.send(`Could not find the target player.`);
        return;
    }

    if (distance2d(target.pos, player.pos) > DEFAULT_CONFIG.COMMAND_WHISPER_DISTANCE) {
        player.send(`Player is too far away.`);
        return;
    }

    const fullMessage = args.join(' ');
    player.send(`${wc}You whisper: '${fullMessage}' to ${target.data.name}`);
    target.send(`${wc}${player.data.name} whispers: ${fullMessage}`);
}
