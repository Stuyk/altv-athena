import * as alt from 'alt-client';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

type MessageCallback = (msg: string) => void;

const callbacks: Array<MessageCallback> = [];
const messages: Array<string> = [];

export const MessengerSystem = {
    /**
     * Register a callback that handles messages.
     * The messages from other clients, and Athena itself will be pushed through all callbacks registered.
     * Useful for plugin creators.
     *
     * @param {MessageCallback} callback
     */
    register(callback: MessageCallback) {
        callbacks.push(callback);
    },
    /**
     * Emits a message to all callbacks.
     *
     * @param {string} msg
     */
    emit(msg: string) {
        // Automatically inserts newest message at beginning.
        messages.unshift(msg);
        if (messages.length >= 256) {
            messages.pop();
        }

        if (callbacks.length <= 0) {
            alt.log(msg);
            return;
        }

        for (let cb of callbacks) {
            cb(msg);
        }
    },
    /**
     * Return current chat history.
     * Newest message is always first element in array.
     *
     * @return {Array<string>}
     */
    history(): Array<string> {
        return messages;
    },
    /**
     * Takes a message, or command and processes it from an input.
     * Commands must start with a forward slash. Such as '/'.
     *
     * @param {string} msg
     */
    send(msg: string) {
        alt.emitServer(MESSENGER_EVENTS.TO_SERVER.MESSAGE, msg);
    },
};

alt.onServer(SYSTEM_EVENTS.TICKS_START, () => {
    alt.onServer(MESSENGER_EVENTS.TO_CLIENT.MESSAGE, MessengerSystem.emit);
});
