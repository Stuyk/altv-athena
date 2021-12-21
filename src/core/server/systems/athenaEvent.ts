import * as alt from 'alt-server';
import {
    ATHENA_EVENTS_PLAYER,
    ATHENA_EVENTS_PLAYER_CLIENT,
    ATHENA_EVENTS_VEHICLE,
} from '../../shared/enums/athenaEvents';

const events: { [key: string]: Array<any> } = {};

type playerCallback = (result: alt.Player, ...args: any) => void;
type vehicleCallback = (result: alt.Vehicle, ...args: any) => void;

function on(
    eventName: ATHENA_EVENTS_PLAYER | ATHENA_EVENTS_VEHICLE | ATHENA_EVENTS_PLAYER_CLIENT,
    callback: playerCallback | vehicleCallback,
) {
    if (!events[eventName]) {
        events[eventName] = [];
    }

    events[eventName].push(callback);
}

/**
 * Used to bind events to callbacks.
 * @export
 * @class EventController
 */
export class EventController {
    /**
     * Subscribe to an Athena Player event.
     * @static
     * @param {ATHENA_EVENTS_PLAYER | ATHENA_EVENTS_PLAYER_CLIENT} eventName
     * @param {playerCallback} callback
     * @memberof EventController
     */
    static onPlayer(eventName: ATHENA_EVENTS_PLAYER | ATHENA_EVENTS_PLAYER_CLIENT, callback: playerCallback) {
        on(eventName, callback);
    }

    /**
     * Subscribe to an Athena Vehicle event.
     * @static
     * @param {ATHENA_EVENTS_VEHICLE} eventName
     * @param {vehicleCallback} callback
     * @memberof EventController
     */
    static onVehicle(eventName: ATHENA_EVENTS_VEHICLE, callback: vehicleCallback) {
        on(eventName, callback);
    }
}

function processCallbacks(eventName: string, args: any[]) {
    if (!events[eventName]) {
        return;
    }

    events[eventName].forEach((callback: Function) => {
        callback(...args);
    });
}

Object.values(ATHENA_EVENTS_PLAYER).forEach((eventName) => {
    alt.on(eventName, (...args: any[]) => {
        processCallbacks(eventName.toString(), args);
    });
});

Object.values(ATHENA_EVENTS_VEHICLE).forEach((eventName) => {
    alt.on(eventName, (...args: any[]) => {
        processCallbacks(eventName.toString(), args);
    });
});

Object.values(ATHENA_EVENTS_PLAYER_CLIENT).forEach((eventName) => {
    alt.onClient(eventName, (...args: any[]) => {
        processCallbacks(eventName.toString(), args);
    });
});
