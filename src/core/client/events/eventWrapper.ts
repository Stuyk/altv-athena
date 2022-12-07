import { UID } from '@AthenaClient/utility/uid';
import * as alt from 'alt-client';

const events: Map<string, Array<{ uid: string; callback: Function }>> = new Map();

const InternalFunctions = {
    invokeCallbacks(events: Array<{ uid: string; callback: Function }>, ...args: any[]) {
        for (let event of events) {
            event.callback(...args);
        }
    },
    keyDown(keycode: number) {
        const currentEvents = events.has('keydown') ? events.get('keydown') : [];
        InternalFunctions.invokeCallbacks(currentEvents, keycode);
    },
    keyUp(keycode: number) {
        const currentEvents = events.has('keyup') ? events.get('keyup') : [];
        InternalFunctions.invokeCallbacks(currentEvents, keycode);
    },
    disconnect() {
        const currentEvents = events.has('disconnect') ? events.get('disconnect') : [];
        InternalFunctions.invokeCallbacks(currentEvents);
    },
    init() {
        alt.on('keydown', InternalFunctions.keyDown);
        alt.on('keyup', InternalFunctions.keyUp);
        alt.on('disconnect', InternalFunctions.disconnect);
    },
};

export const EventWrapper = {
    on(eventName: string, callback: Function): string {
        const uid = UID.generate();
        const currentEvents = events.has(eventName) ? events.get(eventName) : [];
        currentEvents.push({ uid, callback });
        events.set(eventName, currentEvents);
        alt.log(`Added Event: ${eventName} with UID: ${uid}`);
        return uid;
    },
    off(eventName: string, uid: string) {
        const currentEvents = events.has(eventName) ? events.get(eventName) : [];
        const index = currentEvents.findIndex((x) => x.uid === uid);
        if (index <= -1) {
            return;
        }

        alt.log(`Removed Event: ${eventName} with UID: ${uid}`);
        currentEvents.splice(index, 1);
        events.set(eventName, currentEvents);
    },
};

InternalFunctions.init();
