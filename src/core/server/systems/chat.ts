import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { View_Events_Chat } from '../../shared/enums/views';
import { CHARACTER_PERMISSIONS, PERMISSIONS } from '../../shared/flags/permissionFlags';
import { Command } from '../../shared/interfaces/command';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { isFlagEnabled } from '../../shared/utility/flags';
import { getClosestTypes } from '../../shared/utility/vector';
import { Athena } from '../api/athena';
import { DEFAULT_CONFIG } from '../athena/main';
import Logger from '../utility/athenaLogger';
import { emitAll } from '../utility/emitHelper';

const maxMessageLength: number = 128;
const printCommands = false;
let commandCount = 0;
let commandInterval: number | undefined;

class InternalFunctions {
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
            InternalFunctions.handleCommand(player, commandName, ...args);
            return;
        }

        if (!DEFAULT_CONFIG.CHAT_ENABLED) {
            return;
        }

        if (player.data.isDead) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_CHAT_WHILE_DEAD));
            return;
        }

        const closestPlayers: Array<alt.Player> = getClosestTypes<alt.Player>(
            player.pos,
            alt.Player.all,
            DEFAULT_CONFIG.CHAT_DISTANCE,
            ['discord'], // Used to check if they're logged in.
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
            Athena.player.emit.message(
                player,
                `{FF0000} ${LocaleController.get(LOCALE_KEYS.COMMAND_NOT_VALID, `/${commandName}`)}`,
            );
            return;
        }

        if (commandInfo.permission) {
            const isAdminPermissionValid = isFlagEnabled(player.accountData.permissionLevel, commandInfo.permission);

            if (!isAdminPermissionValid) {
                Athena.player.emit.message(
                    player,
                    `{FF0000} ${LocaleController.get(LOCALE_KEYS.COMMAND_NOT_PERMITTED_ADMIN)}`,
                );
                return;
            }
        }

        if (commandInfo.characterPermissions) {
            if (!player.data.characterPermission) {
                Athena.player.emit.message(
                    player,
                    `{FF0000} ${LocaleController.get(LOCALE_KEYS.COMMAND_NOT_PERMITTED_CHARACTER)}`,
                );
                return;
            }

            const isCharacterPermValid = isFlagEnabled(
                player.data.characterPermission,
                commandInfo.characterPermissions,
            );

            if (!isCharacterPermValid) {
                Athena.player.emit.message(
                    player,
                    `{FF0000} ${LocaleController.get(LOCALE_KEYS.COMMAND_NOT_PERMITTED_CHARACTER)}`,
                );
                return;
            }
        }

        commandInfo.func(player, ...args);
    }
}

export default class ChatController {
    static commands: { [key: string]: Command } = {};

    /**
     * Creates an executable command to
     * @static
     * @param {string} name The name of the command.
     * @param {string} description The description of this command.
     * @param {PERMISSIONS} permissions Permission needed to run this command.
     * @param {Function} callback
     * @return {*}
     * @memberof ChatController
     */
    static addCommand(name: string, description: string, permissions: PERMISSIONS, callback: Function): void {
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
            permission: permissions,
        };
    }

    /**
     * A command that requires character permission to run it.
     * @static
     * @param {string} name
     * @param {string} description
     * @param {CHARACTER_PERMISSIONS} characterPermissions
     * @param {Function} callback
     * @memberof ChatController
     */
    static addCharacterCommand(
        name: string,
        description: string,
        characterPermissions: CHARACTER_PERMISSIONS,
        callback: Function,
    ): void {
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
            characterPermissions,
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
     * Gets the description of a command based on its name.
     * Always append '/' when using this function.
     * Example: '/engine'
     * @static
     * @param {string} commandName
     * @return {string}
     * @memberof ChatController
     */
    static getDescription(commandName: string): string {
        return ChatController.commands[commandName].description;
    }

    /**
     * Pushes all the commands down to the client with their descriptions.
     * @static
     * @param {alt.Player} player
     * @memberof ChatController
     */
    static populateCommands(player: alt.Player): void {
        const commandList: Array<Command> = [];

        Object.keys(ChatController.commands).forEach((key) => {
            const commandInfo = ChatController.commands[key];

            if (commandInfo.permission === 0 || commandInfo.characterPermissions === 0) {
                commandList.push({
                    name: commandInfo.name,
                    description: commandInfo.description,
                    permission: commandInfo.permission,
                });
                return;
            }

            // Check Admin Permission Commands
            if (commandInfo.permission) {
                const isAdminPermissionValid = isFlagEnabled(
                    player.accountData.permissionLevel,
                    commandInfo.permission,
                );

                if (!isAdminPermissionValid) {
                    return;
                }

                commandList.push({
                    name: commandInfo.name,
                    description: commandInfo.description,
                    permission: commandInfo.permission,
                });
                return;
            }

            // Check Character Permission Commands
            if (commandInfo.characterPermissions) {
                if (!player.data.characterPermission) {
                    return;
                }

                const isCharacterPermValid = isFlagEnabled(
                    player.data.characterPermission,
                    commandInfo.characterPermissions,
                );
                if (!isCharacterPermValid) {
                    return;
                }

                commandList.push({
                    name: commandInfo.name,
                    description: commandInfo.description,
                    characterPermissions: commandInfo.characterPermissions,
                });
                return;
            }
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

alt.on(SYSTEM_EVENTS.COMMANDS_LOADED, () => {
    alt.onClient(View_Events_Chat.Send, InternalFunctions.handleMessage);
});
