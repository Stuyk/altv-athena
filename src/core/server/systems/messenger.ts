import * as alt from 'alt-server';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger';
import { Athena } from '@AthenaServer/api/athena';

type MessageCallback = (player: alt.Player, msg: string) => void;
type CommandCallback = (player: alt.Player, ...args: any[]) => void;

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

interface MessageCommand {
    /**
     * The plain text iteration of this command.
     *
     * @type {string}
     * @memberof MessageCommand
     */
    name: string;

    /**
     * A description of this command.
     *
     * @type {string}
     * @memberof MessageCommand
     */
    description: string;

    /**
     * An array of individual permission strings required to run this command.
     *
     * @type {Array<string>}
     * @memberof MessageCommand
     */
    permissions: Array<string>;

    /**
     * The function to call when this command is executed by a player, or internal function.
     *
     * @memberof MessageCommand
     */
    callback: CommandCallback;
}

const callbacks: Array<MessageCallback> = [];
const commands: { [command_name: string]: Omit<MessageCommand, 'name'> } = {};

/**
 * Removes HTML brackets, and other escaped garbage.
 *
 * @param {string} msg
 * @return {string}
 */
function cleanMessage(msg: string): string {
    return msg
        .replace(tagOrComment, '')
        .replace('/</g', '&lt;')
        .replace('/', '')
        .replace(/<\/?[^>]+(>|$)/gm, '');
}

const InternalFunctions = {
    player: {
        /**
         * Send a message to an individual player.
         *
         * @param {alt.Player} player
         * @param {string} msg
         */
        send(player: alt.Player, msg: string) {
            player.emit(MESSENGER_EVENTS.TO_CLIENT.MESSAGE, msg);
        },
    },
    players: {
        /**
         * Send a message to a group of players.
         *
         * @param {Array<alt.Player>} players
         * @param {string} msg
         */
        send(players: Array<alt.Player>, msg: string) {
            alt.emitClient(players, MESSENGER_EVENTS.TO_CLIENT.MESSAGE, msg);
        },
    },
    commands: {
        /**
         * Used to execute a command by name.
         *
         * @param {alt.Player} player
         * @param {string} commandName
         * @param {Array<any>} args
         * @return {*}
         */
        execute(player: alt.Player, commandName: string, args: Array<any>) {
            commandName = commandName.toLowerCase();
            const cmdInfo = commands[commandName];

            if (typeof cmdInfo === 'undefined') {
                return;
            }

            if (!Athena.systems.permission.player.hasOne(player, cmdInfo.permissions)) {
                Athena.player.emit.message(player, `/${commandName} - No Permission for Usage`);
                Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }

            commands[commandName].callback(player, ...args);
        },
    },
};

export const MessengerSystem = {
    messages: {
        /**
         * Register a callback that handles messages.
         * The messages from other clients, and Athena itself will be pushed through all callbacks registered.
         * Useful for plugin creators.
         *
         * @param {MessageCallback} callback
         */
        addCallback(callback: MessageCallback) {
            callbacks.push(callback);
        },
        /**
         * Emits a message to all callbacks.
         *
         * @param {string} msg
         */
        emit(player: alt.Player, msg: string) {
            if (msg.charAt(0) === '/') {
                msg = msg.trim().slice(1);
                if (msg.length < 0) {
                    return;
                }

                // Cleanup up extrenious tags, and weird symbols.
                msg = cleanMessage(msg);

                const args = msg.split(' ');
                const commandName = args.shift();
                InternalFunctions.commands.execute(player, commandName.toLowerCase(), args);
                return;
            }

            if (callbacks.length <= 0) {
                const data = Athena.document.character.get(player);
                alt.log(`${data.name} says: ${msg}`);
                return;
            }

            // Cleanup up extrenious tags, and weird symbols.
            msg = cleanMessage(msg);

            for (let cb of callbacks) {
                cb(player, msg);
            }
        },
    },
    commands: {
        execute: InternalFunctions.commands.execute,
        /**
         * Get command information by command name.
         *
         * @param {string} commandName
         * @return {*}
         */
        get(commandName: string) {
            commandName = commandName.toLowerCase().replaceAll('/', '');
            return commands[commandName];
        },
        /**
         * Register a new command that can be called.
         *
         * @param {MessageCommand} command
         * @return {*}
         */
        register(name: string, desc: string, perms: Array<string>, callback: CommandCallback) {
            name = name.toLowerCase().replaceAll('/', '');

            if (commands[name]) {
                alt.logError(`~r~Command ${name} is already registered.`);
                return;
            }

            commands[name] = { description: desc, permissions: perms, callback };
            alt.log(`~lc~Command: ~g~${name}`);
        },
    },
    player: {
        send: InternalFunctions.player.send,
    },
    players: {
        send: InternalFunctions.players.send,
    },
};

alt.onClient(MESSENGER_EVENTS.TO_SERVER.MESSAGE, MessengerSystem.messages.emit);
