import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Task, TaskCallback } from '../../shared/interfaces/TaskTimeline';
import { sleep } from '../utility/sleep';

let timeline: Array<Task | TaskCallback> = [];
let vehicle;
let vehicle_only = false;

class TaskHelper {
    static setTasks(tasks: Array<Task | TaskCallback>, _vehicle: alt.Vehicle = null, _vehicle_only = false) {
        if (!_vehicle) {
            vehicle = null;
        } else {
            vehicle = _vehicle;
            vehicle_only = _vehicle_only;
        }

        timeline = tasks;
        native.clearPedTasks(alt.Player.local.scriptID);

        if (timeline.length <= 0) {
            return;
        }

        alt.setTimeout(TaskHelper.nextTask, 0);
    }

    static async nextTask() {
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
            TaskHelper.nextTask();
            return;
        }

        if (!vehicle) {
            // Not a vehicle task
            native[nativeName](alt.Player.local.scriptID, ...taskParams);
        } else if (vehicle && !vehicle_only) {
            // Vehicle task with player
            native[nativeName](alt.Player.local.scriptID, vehicle.scriptID, ...taskParams);
        } else if (vehicle && vehicle_only) {
            // Vehicle task without player
            native[nativeName](vehicle.scriptID, ...taskParams);
        }

        await sleep(task.timeToWaitInMs);
        if (timeline.length >= 1) {
            alt.setTimeout(TaskHelper.nextTask, 0);
        } else {
            alt.log(`Timeline Completed`);
        }
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_TASK_TIMELINE, TaskHelper.setTasks);
