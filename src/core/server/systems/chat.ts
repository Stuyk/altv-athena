import * as alt from 'alt-server';
import { View_Events_Chat } from '../../shared/enums/views';
import { getClosestTypes } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { emitAll } from '../utility/emitHelper';

const commands = {};

alt.onClient(View_Events_Chat.Send, handleMessage);

export async function handleMessage(player: alt.Player, message: string) {
    if (message.charAt(0) === '/') {
        message = message.trim().slice(1);

        if (message.length < 0) {
            return;
        }

        const args = message.split(' ');
        const commandName = args.shift();
        handleCommand(player, commandName, args);
        return;
    }

    if (!DEFAULT_CONFIG.CHAT_ENABLED) {
        return;
    }

    const closestPlayers: Array<alt.Player> = getClosestTypes<alt.Player>(
        player.pos,
        alt.Player.all,
        DEFAULT_CONFIG.CHAT_DISTANCE
    );

    emitAll(closestPlayers, View_Events_Chat.Append, `${player.name}: ${message}`);
}

export async function handleCommand(player: alt.Player, commandName: string, args: any[]) {}
