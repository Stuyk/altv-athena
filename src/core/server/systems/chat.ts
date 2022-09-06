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
import { consoleCommand } from '../decorators/commands';
import { emitAll } from '../utility/emitHelper';
import { Permission } from './permission';

const maxMessageLength: number = 128;
const printCommands = false;
let commandCount = 0;
let commandInterval: number | undefined;

const tagOrComment = new RegExp(
    '<(?:' +
        // Comment body.
        '!--(?:(?:-*[^->])*--+|-?)' +
        // Special "raw text" elements whose content should be elided.
        '|script\\b' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        '>[\\s\\S]*?</script\\s*' +
        '|style\\b' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        '>[\\s\\S]*?</style\\s*' +
        // Regular name
        '|/?[a-z]' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        ')>',
    'gi',
);

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
        if (!player.data || !player.data._id || !player.accountData) {
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

            message = message
                .replace(tagOrComment, '')
                .replace('/</g', '&lt;')
                .replace('/', '')
                .replace(/<\/?[^>]+(>|$)/gm, '');

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

        const parsedMessage = message
            .replace(tagOrComment, '')
            .replace('/</g', '&lt;')
            .replace('/', '')
            .replace(/<\/?[^>]+(>|$)/gm, '');

        const players = [...alt.Player.all];
        const closestPlayers: Array<alt.Player> = getClosestTypes<alt.Player>(
            player.pos,
            players,
            DEFAULT_CONFIG.CHAT_DISTANCE,
            ['discord'], // Used to check if they're logged in.
        );

        emitAll(closestPlayers, View_Events_Chat.Append, `${player.data.name}: ${parsedMessage}`);
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
        const normalizedName = commandName.toLowerCase();
        const commandInfo = ChatController.commands[normalizedName];
        if (!commandInfo || !commandInfo.func) {
            Athena.player.emit.message(
                player,
                `{FF0000} ${LocaleController.get(LOCALE_KEYS.COMMAND_NOT_VALID, `/${normalizedName}`)}`,
            );
            return;
        }

        if (commandInfo.permission) {
            const isAdminPermissionValid = Permission.isPermissionValidByStrategy(
                player.accountData.permissionLevel,
                commandInfo.permission,
            );

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

            const isCharacterPermValid = Permission.isPermissionValidByStrategy(
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
        if (typeof commandInterval === 'number') {
            try {
                alt.clearTimeout(commandInterval);
            } catch (err) {}
            commandInterval = null;
        }

        commandInterval = alt.setTimeout(() => {
            alt.log(`Total Commands: ${commandCount}`);
        }, 1500);

        const normalizedName = name.toLowerCase();
        if (ChatController.commands[normalizedName]) {
            alt.logError(`[Athena] Command: ${normalizedName} was already registered.`);
            return;
        }

        commandCount += 1;

        if (printCommands) {
            alt.log(`[Athena] Registered Command ${normalizedName}`);
        }

        ChatController.commands[normalizedName] = {
            name: normalizedName,
            description: description.toLowerCase(),
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
        if (typeof commandInterval === 'number') {
            try {
                alt.clearTimeout(commandInterval);
            } catch (err) {}
            commandInterval = null;
        }

        commandInterval = alt.setTimeout(() => {
            alt.log(`Total Commands: ${commandCount}`);
        }, 1500);

        const normalizedName = name.toLowerCase();

        if (ChatController.commands[normalizedName]) {
            alt.logError(`[Athena] Command: ${normalizedName} was already registered.`);
            return;
        }

        commandCount += 1;

        if (printCommands) {
            alt.log(`[Athena] Registered Command ${normalizedName}`);
        }

        ChatController.commands[normalizedName] = {
            name: normalizedName,
            description: description.toLowerCase(),
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
                const isAdminPermissionValid = Permission.isPermissionValidByStrategy(
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

                const isCharacterPermValid = Permission.isPermissionValidByStrategy(
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

    @consoleCommand('/dumpcommands')
    static printAllCommands() {
        let allCommands: Array<Command> = [];

        Object.keys(ChatController.commands).forEach((key) => {
            const cmdData = ChatController.commands[key];
            allCommands.push(cmdData);
            console.log(cmdData);
        });

        let adminCommands = allCommands.filter((x) =>
            isFlagEnabled(x.permission, PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR),
        );

        let moderatorCommands = allCommands.filter((x) => isFlagEnabled(x.permission, PERMISSIONS.MODERATOR));

        let normalCommands = allCommands.filter(
            (x) => !isFlagEnabled(x.permission, PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR),
        );

        console.log(`ADMIN`);
        for (let i = 0; i < adminCommands.length; i++) {
            console.log(adminCommands[i].description);
        }

        console.log('MODERATOR');
        for (let i = 0; i < moderatorCommands.length; i++) {
            console.log(moderatorCommands[i].description);
        }

        console.log('USER');
        for (let i = 0; i < normalCommands.length; i++) {
            console.log(normalCommands[i].description);
        }
    }
}

alt.on(SYSTEM_EVENTS.COMMANDS_LOADED, () => {
    alt.onClient(View_Events_Chat.Send, InternalFunctions.handleMessage);
});
