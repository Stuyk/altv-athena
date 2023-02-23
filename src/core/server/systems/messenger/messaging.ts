import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import * as commands from './commands';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

type MessageCallback = (player: alt.Player, msg: string) => void;

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
    return msg
        .replace(tagOrComment, '')
        .replace('/</g', '&lt;')
        .replace('/', '')
        .replace(/<\/?[^>]+(>|$)/gm, '');
}

/**
 * Send a message to an individual player.
 *
 * @param {alt.Player} player
 * @param {string} msg
 */
export function send(player: alt.Player, msg: string) {
    player.emit(MESSENGER_EVENTS.TO_CLIENT.MESSAGE, msg);
}

/**
 * Send a message to a group of players.
 *
 * @param {Array<alt.Player>} players
 * @param {string} msg
 */
export function sendToPlayers(players: Array<alt.Player>, msg: string) {
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
    callbacks.push(callback);
}

/**
 * Emits a message to all callbacks.
 *
 * @param {string} msg
 */
export function emit(player: alt.Player, msg: string) {
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
