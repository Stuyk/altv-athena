import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from 'core/shared/enums/system';
import { JobTrigger } from 'core/shared/interfaces/JobTrigger';
import { View } from 'core/client/extensions/view';

const url = `http://resource/client/views/job/html/index.html`;
let trigger: JobTrigger;
let view: View;
let isOpen = false;

alt.onServer(SYSTEM_EVENTS.INTERACTION_JOB, handleView);

async function handleView(_trigger: JobTrigger) {
    trigger = _trigger;
    view = await View.getInstance(url, true, false, true);
    view.on('job:Select', handleAction);
    view.on('job:Exit', handleClose);
    view.on('ready', handleReady);
    alt.toggleGameControls(false);
    isOpen = true;
}

function handleAction() {
    alt.emitServer(SYSTEM_EVENTS.INTERACTION_JOB_ACTION, trigger.event);
    handleClose();
}

function handleClose() {
    isOpen = false;
    alt.toggleGameControls(true);

    if (!view) {
        return;
    }

    view.close();
}

function handleReady() {
    if (!view) {
        return;
    }

    view.emit('job:Data', trigger);
}
