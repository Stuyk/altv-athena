import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import * as alt from 'alt-client';

const callbacks: Array<Function> = [];

const Internal = {
    init() {
        for (let cb of callbacks) {
            cb();
        }
    },
};

export const onTicksStart = {
    /**
     * Adds a callback to a function after a player has selected a character or reached the spawned state.
     * This enables functionality after the user is fully mobile in the world.
     *
     * @param {Function} callback
     */
    add(callback: Function) {
        callbacks.push(callback);
    },
};

alt.onServer(SYSTEM_EVENTS.TICKS_START, Internal.init);
