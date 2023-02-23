import * as alt from 'alt-server';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger';
import * as Athena from '@AthenaServer/api';
import { CommandCallback, MessageCommand } from '@AthenaShared/interfaces/messageCommand';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

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
    if (!Athena.systems.permission[dataName].hasOne(player, cmdInfo.permissions)) {
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
 * @return {*}
 */
export function get(commandName: string) {
    commandName = commandName.toLowerCase().replaceAll('/', '');
    return commands[commandName];
}
/**
 * Register a new command that can be called.
 *
 * @param {MessageCommand} command
 * @return {*}
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

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, () => {
    Athena.events.player.on('selected-character', populateCommands);
});

export default { execute, get, populateCommands, register };
