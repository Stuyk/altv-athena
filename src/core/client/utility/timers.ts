import * as alt from 'alt-client';
import { getAverage } from './math';

interface TimerInfo {
    name?: string;
    id: number;
    ms: number;
}

const TIMER_CATEGORIES = {
    SMALLEST: [0, 1],
    SMALL: [2, 9],
    MEDIUM: [10, 99],
    LARGE: [100, 999],
    HUGE: [1000, 999999999]
};

const timers: Array<TimerInfo> = [];
const timersData: { [key: number]: Array<number> } = {};
const timeouts: Array<TimerInfo> = [];
let count;

export class Timer {
    /**
     * Created a tracked interval that is called every 'x' ms.
     * @param {(...args: any[]) => void} callback
     * @param {number} ms
     * @return {*}  {number}
     * @memberof Timer
     */
    static createInterval(callback: (...args: any[]) => void, ms: number, name = ''): number {
        const id = alt.setInterval(async () => {
            const startTime = Date.now();
            await callback();
            const totalTime = Date.now() - startTime;
            if (!timersData[id]) {
                timersData[id] = [];
            }

            if (timersData[id].length >= 25) {
                timersData[id].shift();
            }

            timersData[id].push(totalTime);
        }, ms);

        alt.log(`| Interval | ID ${id} | ${name} | ${ms}ms |`);
        timers.push({ id, ms, name });
        return id;
    }

    /**
     * Clear a track interval.
     * @param {number} intervalNumber
     * @memberof Timer
     */
    static clearInterval(intervalNumber: number) {
        if (intervalNumber !== undefined) {
            alt.clearInterval(intervalNumber);
        }

        const index = timers.findIndex((x) => x.id === intervalNumber);
        if (index <= -1) {
            return;
        }

        const data = timers[index];
        alt.log(`| Clear Interval | ID ${data.id} | ${data.name} |`);
        timers.splice(index, 1);
    }

    /**
     * Clear a tracked timeout early. Removes callback if cleared.
     * @param {number} timeoutNumber
     * @memberof Timer
     */
    static clearTimeout(timeoutNumber: number, doNotClear: boolean = false) {
        if (!doNotClear) {
            alt.clearTimeout(timeoutNumber);
        }

        const index = timeouts.findIndex((x) => x.id === timeoutNumber);
        if (index <= -1) {
            return;
        }

        timeouts.splice(index, 1);
    }

    /**
     * Create a tracked timeout that expires after 'x' ms.
     * @param {(...args: any[]) => void} callback
     * @param {number} ms
     * @return {*}  {number}
     * @memberof Timer
     */
    static createTimeout(callback: (...args: any[]) => void, ms: number): number {
        const id = alt.setTimeout(() => {
            Timer.clearTimeout(id, true);
            callback();
        }, ms);

        timeouts.push({ id, ms });
        return id;
    }

    static getTimers() {
        for (let i = 0; i < timers.length; i++) {
            const timer = timers[i];
            alt.log(`| Interval | ID ${timer.id} | ${timer.name} | ${timer.ms}ms |`);
        }
    }

    static getTimersInfo() {
        alt.log(`=== TIMERS INFO ===`);
        Object.keys(TIMER_CATEGORIES).forEach((category) => {
            const [smallMS, largeMS] = TIMER_CATEGORIES[category];
            const validTimers = timers.filter((x) => x.ms >= smallMS && x.ms <= largeMS);
            const count = validTimers ? validTimers.length : 0;
            alt.log(`${count} || ${smallMS}ms - ${largeMS}ms`);
        });
    }

    static getTimerInfo(id: string) {
        if (!timersData[id]) {
            alt.log(`No Timer Info for ${id}`);
            return;
        }

        const avg = getAverage(timersData[id]);
        alt.log(`${id} || Completion Time: ${avg}ms`);
    }

    static getTimeoutInfo() {
        alt.log(`=== INTERVAL INFO ===`);
        const count = timeouts.length;
        alt.log(`Total: ${count}`);
    }

    static parse(cmd: string, id: string) {
        if (cmd.includes('timerslist')) {
            Timer.getTimers();
            return;
        }

        if (cmd.includes('timerinfo')) {
            if (id) {
                Timer.getTimerInfo(id);
                return;
            }

            Timer.getTimersInfo();
            return;
        }

        if (cmd.includes('timeoutinfo')) {
            Timer.getTimeoutInfo();
            return;
        }
    }
}

alt.on('consoleCommand', Timer.parse);
