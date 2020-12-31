import * as alt from 'alt-server';
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
        player.send(`/whisper [player_id] [message]`);
        return;
    }

    if (id === null) {
        player.send(`/whisper [player_id] [message]`);
        return;
    }

    const players = [...alt.Player.all];
    const target = players.find((target) => target && id === target.id.toString());

    if (!target || !target.valid) {
        player.send(`Player was not found.`);
        return;
    }

    if (distance2d(target.pos, player.pos) > DEFAULT_CONFIG.COMMAND_WHISPER_DISTANCE) {
        player.send(`Player is too far from you.`);
        return;
    }

    const fullMessage = args.join(' ');
    target.send(`${wc}${player.data.name} whispers: ${fullMessage}`);
}
