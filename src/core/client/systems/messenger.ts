import * as alt from 'alt-client';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger.js';
import { MessageCommand } from '@AthenaShared/interfaces/messageCommand.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';

export type MessageInfo = { timestamp: number; msg: string };
export type MessageCallback = (msg: string) => void;
export type HistoryCallback = (msgs: Array<MessageInfo>) => void;

const callbacks: Array<MessageCallback> = [];
const historyCallbacks: Array<HistoryCallback> = [];
const messages: Array<MessageInfo> = [];
let commands: Array<Omit<MessageCommand<alt.Player>, 'callback'>> = [];

/**
 * Register a callback that handles messages.
 * The messages from other clients, and Athena itself will be pushed through all callbacks registered.
 * Useful for plugin creators.
 *
 * @param {MessageCallback} callback
 */
export function registerMessageCallback(callback: MessageCallback) {
    callbacks.push(callback);
}

/**
 * Register a callback that handles messages.
 * The messages from other clients, and Athena itself will be pushed through all callbacks registered.
 * Useful for plugin creators.
 *
 * @param {HistoryCallback} callback
 */
export function registerHistoryCallback(callback: HistoryCallback) {
    historyCallbacks.push(callback);
}

/**
 * Emits a message to all callbacks.
 *
 * @param {string} msg
 */
export function emit(msg: string) {
    // Automatically inserts newest message at beginning.
    messages.unshift({ timestamp: Date.now(), msg });
    if (messages.length >= 256) {
        messages.pop();
    }

    if (callbacks.length >= 1) {
        for (let cb of callbacks) {
            cb(msg);
        }
    } else {
        alt.log(msg);
    }

    if (historyCallbacks.length >= 1) {
        for (let cb of historyCallbacks) {
            cb(messages);
        }
    }
}

/**
 * Return current chat history.
 * Newest message is always first element in array.
 *
 * @return {Array<{ timestamp: number, msg: string }>}
 */
export function getHistory(): Array<{ timestamp: number; msg: string }> {
    return messages;
}

/**
 * Takes a message, or command and processes it from an input.
 * Commands must start with a forward slash. Such as '/'.
 *
 * @param {string} msg
 */
export function send(msg: string) {
    alt.emitServer(MESSENGER_EVENTS.TO_SERVER.MESSAGE, msg);
}

/**
 * Populates the local command list for the client.
 * Which can be used to
 *
 * @param {Array<Omit<MessageCommand<alt.Player>, 'callback'>>} commands
 */
export function setCommands(_commands: Array<Omit<MessageCommand<alt.Player>, 'callback'>>) {
    alt.log(`~g~Populated command list with ${_commands.length} commands.`);
    commands = _commands;
}

/**
 * Get the commands that this client has permission for.
 *
 * @return {Array<Omit<MessageCommand<alt.Player>, 'callback'>>}
 */
export function getCommands(): Array<Omit<MessageCommand<alt.Player>, 'callback'>> {
    return commands;
}

onTicksStart.add(() => {
    alt.onServer(MESSENGER_EVENTS.TO_CLIENT.MESSAGE, emit);
    alt.onServer(MESSENGER_EVENTS.TO_CLIENT.COMMANDS, setCommands);
});
