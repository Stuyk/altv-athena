import * as alt from 'alt-server';
import { VIEW_EVENTS_JOB_TRIGGER } from '@AthenaShared/enums/views.js';
import { JobTrigger } from '@AthenaShared/interfaces/jobTrigger.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';

const LastTriggers: { [id: string]: JobTrigger } = {};

const Internal = {
    init() {
        alt.onClient(VIEW_EVENTS_JOB_TRIGGER.ACCEPT, Internal.accept);
        alt.onClient(VIEW_EVENTS_JOB_TRIGGER.CANCEL, Internal.cancel);
    },

    /**
     * Invoke a callback or event based on what is specified in the JobTrigger data.
     *
     * @static
     * @param {alt.Player} player An alt:V Player Entity
     * @param {number?} amount
     * @return {void}
     */
    accept(player: alt.Player, amount?: number) {
        if (!player || !player.valid) {
            return;
        }

        if (!LastTriggers[player.id]) {
            return;
        }

        const data = LastTriggers[player.id];

        if (data.event) {
            alt.emit(data.event, player);
        }

        if (data.acceptCallback && typeof data.acceptCallback === 'function') {
            if (amount === undefined) {
                data.acceptCallback(player);
            } else {
                data.acceptCallback(player, amount);
            }
        }

        delete LastTriggers[player.id];
    },

    /**
     * Invoke a callback or event based on what is specified in the JobTrigger data.
     *
     * @static
     * @param {alt.Player} player An alt:V Player Entity
     * @return {void}
     *
     */
    cancel(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        if (!LastTriggers[player.id]) {
            return;
        }

        const data = LastTriggers[player.id];

        if (data.cancelEvent) {
            alt.emit(data.cancelEvent, player);
        }

        if (data.cancelCallback && typeof data.cancelCallback === 'function') {
            data.cancelCallback(player);
        }

        delete LastTriggers[player.id];
    },
};

/**
 * Creates a WebView Job Window to show to the player.
 * Will invoke a callback or an event if accepted or declined.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {JobTrigger} data
 * @return {void}
 */
export function create(player: alt.Player, data: JobTrigger) {
    if (Overrides.create) {
        return Overrides.create(player, data);
    }

    if (!player || !player.valid) {
        return;
    }

    LastTriggers[player.id] = data;
    alt.emitClient(player, VIEW_EVENTS_JOB_TRIGGER.OPEN, deepCloneObject(data));
}

interface JobTriggerFuncs {
    create: typeof create;
}

const Overrides: Partial<JobTriggerFuncs> = {};

export function override(functionName: 'create', callback: typeof create);
/**
 * Used to override job trigger functions.
 *
 *
 * @param {keyof JobTriggerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JobTriggerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
