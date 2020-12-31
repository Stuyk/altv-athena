import * as alt from 'alt-server';
import { View_Events_Chat } from '../../shared/enums/views';
import { getClosestTypes } from '../../shared/utility/vector';
import { addCommand } from '../systems/chat';
import { emitAll } from '../utility/emitHelper';

const rpc = `{C39ADD}`; // Roleplay Color

addCommand('me', handleCommand);

function handleCommand(player: alt.Player, ...args): void {
    if (args.length <= 0) {
        return;
    }

    const fullMessage = args.join(' ');
    const closestPlayers = getClosestTypes<alt.Player>(player.pos, alt.Player.all, 25, ['discord']);
    emitAll(closestPlayers, View_Events_Chat.Append, `${rpc}${player.data.name} ${fullMessage}`);
}
