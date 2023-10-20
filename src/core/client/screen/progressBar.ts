import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { ProgressBar } from '@AthenaShared/interfaces/progressBar.js';

const barWidth = 0.08; // Based on percentages of screen.
const barHeight = 0.02;
const bars: Array<ProgressBar> = [];

let interval;
let pause = false;

function drawBars() {
    if (pause) {
        return;
    }

    for (let i = bars.length - 1; i >= 0; i--) {
        const bar = bars[i];

        if (pause) {
            return;
        }

        if (Date.now() >= bar.finalTime) {
            bars.splice(i, 1);
            clear();
            continue;
        }

        if (AthenaClient.utility.vector.distance2d(bar.position, alt.Player.local.pos) > bar.distance) {
            continue;
        }

        AthenaClient.screen.text.drawRectangle(
            bar.position,
            { x: barWidth + 0.005, y: barHeight + 0.01 },
            new alt.RGBA(0, 0, 0, 150),
        );

        const timeLeft = bar.finalTime - Date.now();
        const actualTime = Math.abs(timeLeft - bar.milliseconds);
        const percentage = actualTime / bar.milliseconds;
        const timeDiff = percentage * barWidth; // Calculate Dynamic Width of Progress Bar
        AthenaClient.screen.text.drawRectangle(bar.position, { x: timeDiff, y: barHeight }, bar.color);

        const percentageText = (percentage * 100).toFixed(2);
        if (bar.percentageEnabled) {
            const actualText = bar.text ? `${bar.text} (${percentageText}%)` : `${percentageText}%`;
            AthenaClient.screen.text.drawText3D(actualText, bar.position, 0.35, new alt.RGBA(255, 255, 255, 255));
        } else {
            const actualText = bar.text ? `${bar.text}` : `${bar.text}`;
            AthenaClient.screen.text.drawText3D(actualText, bar.position, 0.35, new alt.RGBA(255, 255, 255, 255));
        }
    }
}

/**
 * Create a new progress bar.
 * @param {ProgressBar} progressBar - ProgressBar
 * @returns None
 */
export function create(progressBar: ProgressBar) {
    progressBar.startTime = Date.now();
    progressBar.finalTime = Date.now() + progressBar.milliseconds;

    const index = bars.findIndex((bar) => bar.uid === progressBar.uid);
    if (index <= -1) {
        bars.push(progressBar);
    } else {
        alt.logWarning(`${progressBar.uid} was not a unique identifier. Replaced Data in Progress Bar.`);
        bars[index] = progressBar;
    }

    clear();
    if (!interval) {
        interval = alt.setInterval(drawBars, 0);
    }
}

/**
 * `removeBar` removes a bar from the `bars` array.
 * @param {string} uid A unique string - The unique identifier of the bar.
 * @returns The function that is being returned is the function that is being called.
 */
export function remove(uid: string) {
    pause = true;
    const index = bars.findIndex((bar) => bar.uid === uid);

    if (index >= 0) {
        pause = false;
        return;
    }

    bars.splice(index, 1);
    pause = false;
    clear();
}

/**
 * Clear the progress bar if there are no more bars to show.
 * @returns None
 */
export function clear() {
    if (bars.length <= 0) {
        alt.clearInterval(interval);
        interval = null;
    }
}

alt.onServer(SYSTEM_EVENTS.PROGRESSBAR_CREATE, create);
alt.onServer(SYSTEM_EVENTS.PROGRESSBAR_REMOVE, remove);
