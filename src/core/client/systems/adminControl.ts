import { AdminControl, AdminControlEvents } from '@AthenaShared/interfaces/adminControl.js';
import * as alt from 'alt-client';

let AdminControls: Array<AdminControl> = [];
const callbacks: Array<(controls: typeof AdminControls) => void> = [];

/**
 * Invoke an admin control based on its uid.
 *
 * @export
 * @param {string} uid
 * @param {...any[]} args
 */
export function invoke(uid: string, ...args: any[]) {
    alt.emitServer(AdminControlEvents.toServer.invoke, uid, ...args);
}

/**
 * Return all admin controls the player has access to currently
 *
 * @export
 * @return {typeof AdminControls}
 */
export function getControls(): typeof AdminControls {
    return AdminControls;
}

export function onControlUpdate(callback: (controls: typeof AdminControls) => void) {
    callbacks.push(callback);
}

/**
 * Controls updated from the server-side.
 *
 * @param {typeof AdminControls} controls
 */
function updateControls(controls: typeof AdminControls) {
    AdminControls = controls;

    for (let cb of callbacks) {
        if (typeof cb !== 'function') {
            continue;
        }

        cb(controls);
    }
}

alt.onServer(AdminControlEvents.toClient.controls, updateControls);
