import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ProgressBar } from '../../shared/interfaces/ProgressBar';
import { distance2d } from '../../shared/utility/vector';
import { drawRectangle, drawText3D } from '../utility/text';
import { Timer } from '../utility/timers';

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

        if (distance2d(bar.position, alt.Player.local.pos) > bar.distance) {
            continue;
        }

        drawRectangle(bar.position, { x: barWidth + 0.005, y: barHeight + 0.01 }, new alt.RGBA(0, 0, 0, 150));

        const timeLeft = bar.finalTime - Date.now();
        const actualTime = Math.abs(timeLeft - bar.milliseconds);
        const percentage = actualTime / bar.milliseconds;
        const timeDiff = percentage * barWidth; // Calculate Dynamic Width of Progress Bar
        drawRectangle(bar.position, { x: timeDiff, y: barHeight }, bar.color);

        const percentageText = (percentage * 100).toFixed(2);
        const actualText = bar.text ? `${bar.text} (${percentageText}%)` : `${percentageText}%`;
        drawText3D(actualText, bar.position, 0.35, {
            r: 255,
            g: 255,
            b: 255,
            a: 255
        });
    }
}

function createBar(progressBar: ProgressBar) {
    const index = bars.findIndex((bar) => bar.uid === progressBar.uid);

    if (index >= 0) {
        throw new Error(`Progress bar does not have a unique UID.`);
    }

    progressBar.startTime = Date.now();
    progressBar.finalTime = Date.now() + progressBar.milliseconds;
    bars.push(progressBar);

    clear();
    if (!interval) {
        interval = Timer.createInterval(drawBars, 0, 'progressBar.ts');
    }
}

function removeBar(uid: string) {
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

function clear() {
    if (bars.length <= 0) {
        Timer.clearInterval(interval);
        interval = null;
    }
}

alt.onServer(SYSTEM_EVENTS.PROGRESSBAR_CREATE, createBar);
alt.onServer(SYSTEM_EVENTS.PROGRESSBAR_REMOVE, removeBar);
