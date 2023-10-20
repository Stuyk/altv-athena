import * as alt from 'alt-server';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger.js';
import * as Athena from '@AthenaServer/api/index.js';
import { CommandCallback, DetailedCommand, MessageCommand } from '@AthenaShared/interfaces/messageCommand.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { getParamNames } from '@AthenaShared/utility/getParamNames.js';

const commands: { [command_name: string]: Omit<MessageCommand<alt.Player>, 'name'> } = {};

/**
 * Used to execute a command by name.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} commandName
 * @param {Array<any>} args
 * @return {void}
 */
export function execute(player: alt.Player, commandName: string, args: Array<any>) {
    if (Overrides.execute) {
        return Overrides.execute(player, commandName, args);
    }

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
    if (Overrides.get) {
        return Overrides.get(commandName);
    }

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
    if (Overrides.register) {
        return Overrides.register(name, desc, perms, callback, isCharacterPermission);
    }

    name = name.toLowerCase().replaceAll('/', '');

    if (commands[name]) {
        alt.logError(`~r~Command ${name} is already registered.`);
        return;
    }

    commands[name] = { description: desc, permissions: perms, callback, isCharacterPermission };
    alt.log(`~lc~Command: ~g~${name}`);

    if (alt.Player.all.length <= 0) {
        return;
    }

    alt.Player.all.forEach((player) => {
        populateCommands(player);
    });
}

/**
 * Get all commands that are associated with a player's current permission level.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function populateCommands(player: alt.Player) {
    if (Overrides.populateCommands) {
        return Overrides.populateCommands(player);
    }

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
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {Array<DetailedCommand>}
 */
export function getCommands(player: alt.Player): Array<DetailedCommand> {
    if (Overrides.getCommands) {
        return Overrides.getCommands(player);
    }

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

interface CommandFuncs {
    execute: typeof execute;
    get: typeof get;
    getCommands: typeof getCommands;
    populateCommands: typeof populateCommands;
    register: typeof register;
}

const Overrides: Partial<CommandFuncs> = {};

export function override(functionName: 'execute', callback: typeof execute);
export function override(functionName: 'get', callback: typeof get);
export function override(functionName: 'getCommands', callback: typeof getCommands);
export function override(functionName: 'populateCommands', callback: typeof populateCommands);
export function override(functionName: 'register', callback: typeof register);
/**
 * Used to override command functionality
 *
 *
 * @param {keyof CommandFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof CommandFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
