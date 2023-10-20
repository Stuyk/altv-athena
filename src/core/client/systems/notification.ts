import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';

export type NotificationCallback = ((message: string, ...args: any[]) => void) | Function;

const callbacks: Array<NotificationCallback> = [];

let isDefaultEnabled = true;

function handler(message: string, ...args: any[]) {
    if (callbacks.length >= 1) {
        for (let callback of callbacks) {
            callback(message, ...args);
        }
    }

    if (!isDefaultEnabled) {
        return;
    }

    AthenaClient.screen.notification.create(message);
}

/**
 * Disable the default notification handler
 *
 *
 */
export function disableDefault() {
    isDefaultEnabled = false;
}

/**
 * Call a function back when a notification is received.
 *
 * Good for overwriting the default notification system and handling it on your own.
 *
 *
 * @param {NotificationCallback} callback
 */
export function addCallback(callback: NotificationCallback) {
    callbacks.push(callback);
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, handler);
