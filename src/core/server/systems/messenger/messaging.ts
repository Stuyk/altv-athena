import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import * as commands from './commands.js';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';

export type MessageCallback = (player: alt.Player, msg: string) => void;

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

const callbacks: Array<MessageCallback> = [];

/**
 * Removes HTML brackets, and other escaped garbage.
 *
 * @param {string} msg
 * @return {string}
 */
function cleanMessage(msg: string): string {
    if (Overrides.cleanMessage) {
        return Overrides.cleanMessage(msg);
    }

    return msg
        .replace(tagOrComment, '')
        .replace('/</g', '&lt;')
        .replace('/', '')
        .replace(/<\/?[^>]+(>|$)/gm, '');
}

/**
 * Send a message to an individual player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} msg
 */
export function send(player: alt.Player, msg: string) {
    if (Overrides.send) {
        return Overrides.send(player, msg);
    }

    player.emit(MESSENGER_EVENTS.TO_CLIENT.MESSAGE, msg);
}

/**
 * Send a message to a group of players.
 *
 * @param {Array<alt.Player>} players
 * @param {string} msg
 */
export function sendToPlayers(players: Array<alt.Player>, msg: string) {
    if (Overrides.sendToPlayers) {
        return Overrides.sendToPlayers(players, msg);
    }

    alt.emitClient(players, MESSENGER_EVENTS.TO_CLIENT.MESSAGE, msg);
}

/**
 * Register a callback that handles messages.
 * The messages from other clients, and Athena itself will be pushed through all callbacks registered.
 * Useful for plugin creators.
 *
 * @param {MessageCallback} callback
 */
export function addCallback(callback: MessageCallback) {
    if (Overrides.addCallback) {
        return Overrides.addCallback(callback);
    }

    callbacks.push(callback);
}

/**
 * Emits a message to all callbacks.
 *
 * @param {string} msg
 */
export function emit(player: alt.Player, msg: string) {
    if (Overrides.emit) {
        return Overrides.emit(player, msg);
    }

    if (msg.charAt(0) === '/') {
        msg = msg.trim().slice(1);
        if (msg.length < 0) {
            return;
        }

        // Cleanup up extrenious tags, and weird symbols.
        msg = cleanMessage(msg);

        const args = msg.split(' ');
        const commandName = args.shift();
        commands.execute(player, commandName.toLowerCase(), args);
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
}

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, () => {
    alt.onClient(MESSENGER_EVENTS.TO_SERVER.MESSAGE, emit);
});

export default { addCallback, cleanMessage, emit, send, sendToPlayers };

interface MessagingFuncs {
    addCallback: typeof addCallback;
    cleanMessage: typeof cleanMessage;
    emit: typeof emit;
    send: typeof send;
    sendToPlayers: typeof sendToPlayers;
}

const Overrides: Partial<MessagingFuncs> = {};

export function override(functionName: 'addCallback', callback: typeof addCallback);
export function override(functionName: 'cleanMessage', callback: typeof cleanMessage);
export function override(functionName: 'emit', callback: typeof emit);
export function override(functionName: 'send', callback: typeof send);
export function override(functionName: 'sendToPlayers', callback: typeof sendToPlayers);
/**
 * Used to override messaging functionality
 *
 *
 * @param {keyof MessagingFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof MessagingFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
