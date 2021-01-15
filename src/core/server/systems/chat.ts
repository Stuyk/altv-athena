import * as alt from 'alt-server';
import { commandList } from '../../shared/commands/commandList';
import { View_Events_Chat } from '../../shared/enums/views';
import { Command } from '../../shared/interfaces/Command';
import { isFlagEnabled } from '../../shared/utility/flags';
import { getClosestTypes } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { emitAll } from '../utility/emitHelper';

alt.onClient(View_Events_Chat.Send, handleMessage);

const commands: { [key: string]: Command } = {};
const maxMessageLength: number = 128;

for (let i = 0; i < commandList.length; i++) {
    commands[commandList[i].name] = commandList[i];

    if (commandList.length - 1 === i) {
        import('../commands/commands').catch((err) => {
            throw err;
        });
    }
}

/**
 * Used to add a command to the command runtime.
 * @export
 * @param {string} name
 * @param {Function} callback
 * @return {*}
 */
export async function addCommand(name: string, callback: Function) {
    if (!commands[name] && commands.func) {
        alt.logError(
            `[Athena] Failed to register command ${name}. Command description was not added to 'commandList.ts'`
        );
        return;
    }

    if (commands[name] == undefined) {
        alt.logError(`[Athena] Failed to register command ${name}. Command was likely not added to 'commandList.ts'`);
        return;
    }

    commands[name].func = callback;
    alt.log(`[Athena] Registered Command: ${name}`);
}

/**
 * Handles incoming messages from player input.
 * @export
 * @param {alt.Player} player
 * @param {string} message
 * @return {Promise<void>}
 */
export async function handleMessage(player: alt.Player, message: string): Promise<void> {
    // Prevent Chatting from Non-Logged In User
    if (!player.discord || !player.data) {
        return;
    }

    if (message.length >= maxMessageLength) {
        return;
    }

    if (message.charAt(0) === '/') {
        message = message.trim().slice(1);

        if (message.length < 0) {
            return;
        }

        const args = message.split(' ');
        const commandName = args.shift();
        handleCommand(player, commandName, ...args);
        return;
    }

    if (!DEFAULT_CONFIG.CHAT_ENABLED) {
        return;
    }

    if (player.data.isDead) {
        player.emit().message(`You cannot send messages when you are dead.`);
        return;
    }

    const closestPlayers: Array<alt.Player> = getClosestTypes<alt.Player>(
        player.pos,
        alt.Player.all,
        DEFAULT_CONFIG.CHAT_DISTANCE,
        ['discord'] // Used to check if they're logged in.
    );

    emitAll(closestPlayers, View_Events_Chat.Append, `${player.data.name}: ${message}`);
}

/**
 * Handles command routing and execution from player messages.
 * @export
 * @param {alt.Player} player
 * @param {string} commandName
 * @param {...any[]} args
 * @return {Promise<void>}
 */
export async function handleCommand(player: alt.Player, commandName: string, ...args: any[]): Promise<void> {
    const commandInfo = commands[commandName];
    if (!commandInfo || !commandInfo.func) {
        player.emit().message(`/${commandName} is not a valid command.`);
        return;
    }

    if (commandInfo.permission !== 0) {
        if (!isFlagEnabled(player.accountData.permissionLevel, commandInfo.permission)) {
            player.emit().message(`{FF0000} Command is not permitted.`);
            return;
        }
    }

    commandInfo.func(player, ...args);
}
