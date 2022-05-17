import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VIEW_EVENTS_JOB_TRIGGER } from '../../shared/enums/views';
import { JobTrigger } from '../../shared/interfaces/jobTrigger';
import { deepCloneObject } from '../../shared/utility/deepCopy';

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
     * @return {*}
     * @memberof InternalFunctions
     */
    static accept(player: alt.Player) {
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
            data.acceptCallback(player);
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
