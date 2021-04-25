import * as alt from 'alt-server';
import { View_Events_Chat } from '../../shared/enums/views';
import { Command } from '../../shared/interfaces/Command';
import { isFlagEnabled } from '../../shared/utility/flags';
import { getClosestTypes } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { emitAll } from '../utility/emitHelper';
import { Permissions } from '../../shared/flags/permissions';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { playerFuncs } from '../extensions/Player';
import Logger from '../utility/athenaLogger';

const maxMessageLength: number = 128;
const printCommands = false;
let commandCount = 0;
let commandInterval;

export default class ChatController {
    static commands: { [key: string]: Command } = {};

    /**
     * Creates an executable command to
     * @static
     * @param {string} name The name of the command.
     * @param {string} description The description of this command.
     * @param {Permissions} permissions Permission needed to run this command.
     * @param {Function} callback
     * @return {*}
     * @memberof ChatController
     */
    static addCommand(name: string, description: string, permissions: Permissions, callback: Function): void {
        if (commandInterval) {
            alt.clearTimeout(commandInterval);
        }

        commandInterval = alt.setTimeout(() => {
            Logger.info(`Total Commands: ${commandCount}`);
        }, 1500);

        if (ChatController.commands[name]) {
            alt.logError(`[Athena] Command: ${name} was already registered.`);
            return;
        }

        commandCount += 1;

        if (printCommands) {
            alt.log(`[Athena] Registered Command ${name}`);
        }

        ChatController.commands[name] = {
            name,
            description,
            func: callback,
            permission: permissions
        };
    }

    /**
     * Add aliases for a command.
     * @static
     * @param {string} originalName
     * @param {Array<string>} aliasNames
     * @memberof ChatController
     */
    static addAliases(originalName: string, aliasNames: Array<string>): void {
        if (!ChatController.commands[originalName]) {
            alt.logWarning(`[Athena] Could not add aliases for ${originalName}. Command does not exist.`);
            return;
        }

        for (let i = 0; i < aliasNames.length; i++) {
            ChatController.commands[aliasNames[i]] = ChatController.commands[originalName];
            alt.log(`[Athena] Registered Alias ${aliasNames[i]}`);
        }
    }

    /**
     * Handles incoming messages from player input.
     * @export
     * @param {alt.Player} player
     * @param {string} message
     * @return {Promise<void>}
     */
    static handleMessage(player: alt.Player, message: string): void {
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
            ChatController.handleCommand(player, commandName, ...args);
            return;
        }

        if (!DEFAULT_CONFIG.CHAT_ENABLED) {
            return;
        }

        if (player.data.isDead) {
            playerFuncs.emit.message(player, `You cannot send messages when you are dead.`);
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
    static handleCommand(player: alt.Player, commandName: string, ...args: any[]): void {
        const commandInfo = ChatController.commands[commandName];
        if (!commandInfo || !commandInfo.func) {
            playerFuncs.emit.message(player, `/${commandName} is not a valid command.`);
            return;
        }

        if (commandInfo.permission !== 0) {
            if (!isFlagEnabled(player.accountData.permissionLevel, commandInfo.permission)) {
                playerFuncs.emit.message(player, `{FF0000} Command is not permitted.`);
                return;
            }
        }

        commandInfo.func(player, ...args);
    }

    static getDescription(commandName: string): string {
        return ChatController.commands[commandName].description;
    }

    static populateCommands(player: alt.Player): void {
        const commandList: Array<Command> = [];

        Object.keys(ChatController.commands).forEach((key) => {
            const commandInfo = ChatController.commands[key];
            if (!isFlagEnabled(player.accountData.permissionLevel, commandInfo.permission)) {
                return;
            }

            commandList.push({
                name: commandInfo.name,
                description: commandInfo.description,
                permission: commandInfo.permission
            });
        });

        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_COMMANDS, commandList);
    }

    static printAllCommands() {
        Object.keys(ChatController.commands).forEach((key) => {
            const cmdData = ChatController.commands[key];
            console.log(`${cmdData.description}`);
        });
    }
}

// Has to be loaded last.
import('../commands/commands')
    .catch((err) => {
        console.error(err);
        console.error(
            `[Athena] Failed to load a command file. Please fix the error and commands will work normally again.`
        );
    })
    .then(() => alt.onClient(View_Events_Chat.Send, ChatController.handleMessage));
