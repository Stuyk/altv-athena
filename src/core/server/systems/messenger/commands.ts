import * as alt from 'alt-server';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger';
import * as Athena from '@AthenaServer/api';
import { CommandCallback, DetailedCommand, MessageCommand } from '@AthenaShared/interfaces/messageCommand';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { getParamNames } from '@AthenaShared/utility/getParamNames';

const commands: { [command_name: string]: Omit<MessageCommand<alt.Player>, 'name'> } = {};

/**
 * Used to execute a command by name.
 *
 * @param {alt.Player} player
 * @param {string} commandName
 * @param {Array<any>} args
 * @return {*}
 */
export function execute(player: alt.Player, commandName: string, args: Array<any>) {
    commandName = commandName.toLowerCase();
    const cmdInfo = commands[commandName];

    if (typeof cmdInfo === 'undefined') {
        return;
    }

    const dataName = cmdInfo.isCharacterPermission ? 'character' : 'account';
    if (!Athena.systems.permission.hasOne(dataName, player, cmdInfo.permissions)) {
        Athena.player.emit.message(player, `/${commandName} - No Permission for Usage`);
        Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        return;
    }

    commands[commandName].callback(player, ...args);
}

/**
 * Get command information by command name.
 *
 * @param {string} commandName
 */
export function get(commandName: string) {
    commandName = commandName.toLowerCase().replaceAll('/', '');
    return commands[commandName];
}
/**
 * Register a new command that can be called.
 *
 * @param {MessageCommand} command
 */
export function register(
    name: string,
    desc: string,
    perms: Array<string>,
    callback: CommandCallback<alt.Player>,
    isCharacterPermission = false,
) {
    name = name.toLowerCase().replaceAll('/', '');

    if (commands[name]) {
        alt.logError(`~r~Command ${name} is already registered.`);
        return;
    }

    commands[name] = { description: desc, permissions: perms, callback, isCharacterPermission };
    alt.log(`~lc~Command: ~g~${name}`);
}

/**
 * Get all commands that are associated with a player's current permission level.
 *
 * @param {alt.Player} player
 */
export function populateCommands(player: alt.Player) {
    const accountData = Athena.document.account.get(player);
    const characterData = Athena.document.character.get(player);

    if (typeof accountData === 'undefined' || typeof characterData === 'undefined') {
        return;
    }

    const validCommands: Array<Omit<MessageCommand<alt.Player>, 'callback'>> = [];
    Object.keys(commands).forEach((key) => {
        const command = commands[key];
        const dataName = command.isCharacterPermission ? 'character' : 'account';

        if (!Athena.systems.permission.hasOne(dataName, player, command.permissions)) {
            return;
        }

        validCommands.push({
            name: key,
            description: command.description,
            permissions: command.permissions,
            isCharacterPermission: command.isCharacterPermission,
        });
    });

    player.emit(MESSENGER_EVENTS.TO_CLIENT.COMMANDS, validCommands);
}

/**
 * Get all commands the player has access to.
 * Includes names of individual parameters for each callback function as well.
 * Excludes callbacks.
 *
 * @export
 * @param {alt.Player} player
 * @return {Array<DetailedCommand>}
 */
export function getCommands(player: alt.Player): Array<DetailedCommand> {
    const accountData = Athena.document.account.get(player);
    const characterData = Athena.document.character.get(player);

    if (typeof accountData === 'undefined' || typeof characterData === 'undefined') {
        return [];
    }

    const validCommands: Array<Omit<MessageCommand<alt.Player>, 'callback'> & { params: Array<string> }> = [];
    Object.keys(commands).forEach((key) => {
        const command = commands[key];
        const dataName = command.isCharacterPermission ? 'character' : 'account';

        if (!Athena.systems.permission.hasOne(dataName, player, command.permissions)) {
            return;
        }

        // Always remove first param since it is a player
        const params = getParamNames(command.callback);
        params.shift();

        validCommands.push({
            name: key,
            description: command.description,
            permissions: command.permissions,
            isCharacterPermission: command.isCharacterPermission,
            params,
        });
    });

    return validCommands;
}

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, () => {
    Athena.player.events.on('selected-character', populateCommands);
});

export default { execute, get, getCommands, populateCommands, register };
