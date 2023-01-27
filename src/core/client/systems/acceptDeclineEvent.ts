import * as alt from 'alt-client';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { AthenaClient } from '@AthenaClient/api/athena';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { AcceptDeclineEvent } from '@AthenaShared/interfaces/acceptDeclineEvent';

const TAB_KEY = 9;

let lastEvent: AcceptDeclineEvent;

async function handleOpen() {
    if (typeof lastEvent === 'undefined') {
        return;
    }

    if (AthenaClient.webview.isAnyMenuOpen()) {
        return;
    }

    const result = await AthenaClient.rmlui.questionBox.create({ placeholder: lastEvent.question, blur: true });
    const eventToCall = result ? lastEvent.onClientEvents.accept : lastEvent.onClientEvents.decline;
    alt.emitServer(eventToCall, lastEvent.data);
    lastEvent = undefined;
}

function setAcceptDeclineEvent(event: AcceptDeclineEvent) {
    lastEvent = event;
}

function init() {
    AthenaClient.events.keyHeld.register(TAB_KEY, handleOpen);
    alt.onServer(SYSTEM_EVENTS.ACCEPT_DECLINE_EVENT_SET, setAcceptDeclineEvent);
}

onTicksStart.add(init);
