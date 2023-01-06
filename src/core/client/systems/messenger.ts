import * as alt from 'alt-client';

import { MESSENGER_EVENTS } from '@AthenaShared/enums/messenger';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

type MessageCallback = (msg: string) => void;

const callbacks: Array<MessageCallback> = [];

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
        if (callbacks.length <= 0) {
            alt.log(msg);
            return;
        }

        for (let cb of callbacks) {
            cb(msg);
        }
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

alt.on(SYSTEM_EVENTS.TICKS_START, () => {
    alt.onServer(MESSENGER_EVENTS.TO_CLIENT.MESSAGE, MessengerSystem.emit);
});
