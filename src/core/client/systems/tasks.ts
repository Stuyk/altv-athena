import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Task, TaskCallback } from '../../shared/interfaces/TaskTimeline';
import { sleep } from '../utility/sleep';

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, handleTasks);

let timeline: Array<Task | TaskCallback> = [];

function handleTasks(tasks: Array<Task | TaskCallback>) {
    if (alt.Player.local.vehicle) {
        return;
    }

    timeline = tasks;
    native.clearPedTasks(alt.Player.local.scriptID);

    if (timeline.length <= 0) {
        return;
    }

    alt.setTimeout(playNextTimeline, 0);
}

async function playNextTimeline() {
    if (timeline.length <= 0) {
        return;
    }

    let task: Task | TaskCallback = timeline.shift();
    if (!task) {
        return;
    }

    if (task.hasOwnProperty('callbackName')) {
        task = task as TaskCallback;
        alt.emitServer(task.callbackName);
        return;
    }

    task = task as Task;

    const nativeName = task.nativeName;
    const taskParams = task.params;

    if (!native[nativeName]) {
        alt.logWarning(`${nativeName} is not valid for Timeline tasks.`);
        playNextTimeline();
        return;
    }

    alt.setTimeout(() => {
        native[nativeName](alt.Player.local.scriptID, ...taskParams);
    }, 0);

    await sleep(task.timeToWaitInMs);
    if (timeline.length >= 1) {
        alt.setTimeout(playNextTimeline, 0);
    } else {
        alt.log(`Timeline Completed`);
    }
}
