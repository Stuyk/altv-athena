import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { VIEW_EVENTS_JOB_TRIGGER } from '@AthenaShared/enums/views';
import { JobTrigger } from '@AthenaShared/interfaces/jobTrigger';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';

const LastTriggers: { [id: string]: JobTrigger } = {};

class InternalFunctions {
    static init() {
        alt.onClient(VIEW_EVENTS_JOB_TRIGGER.ACCEPT, InternalFunctions.accept);
        alt.onClient(VIEW_EVENTS_JOB_TRIGGER.CANCEL, InternalFunctions.cancel);
    }

    /**
     * Invoke a callback or event based on what is specified in the JobTrigger data.
     *
     * @static
     * @param {alt.Player} player
     * @param {number?} amount
     * @return {*}
     * @memberof InternalFunctions
     */
    static accept(player: alt.Player, amount?: number) {

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
    }

    /**
     * Invoke a callback or event based on what is specified in the JobTrigger data.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof InternalFunctions
     */
    static cancel(player: alt.Player) {
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
    }
}

export class ServerJobTrigger {
    /**
     * Creates a WebView Job Window to show to the player.
     * Will invoke a callback or an event if accepted or declined.
     *
     * @static
     * @param {alt.Player} player
     * @param {JobTrigger} data
     * @return {*}
     * @memberof ServerJobTrigger
     */
    static create(player: alt.Player, data: JobTrigger) {
        if (!player || !player.valid) {
            return;
        }

        LastTriggers[player.id] = data;
        alt.emitClient(player, VIEW_EVENTS_JOB_TRIGGER.OPEN, deepCloneObject(data));
    }
}

InternalFunctions.init();
