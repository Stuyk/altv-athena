import * as alt from 'alt-client';

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
        const id = alt.setInterval(callback, ms);
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

    static getTimersInfo() {
        alt.log(`=== TIMERS INFO ===`);
        Object.keys(TIMER_CATEGORIES).forEach((category) => {
            const [smallMS, largeMS] = TIMER_CATEGORIES[category];
            const validTimers = timers.filter((x) => x.ms >= smallMS && x.ms <= largeMS);
            const count = validTimers ? validTimers.length : 0;
            alt.log(`${count} || ${smallMS}ms - ${largeMS}ms`);
        });
    }

    static getTimeoutInfo() {
        alt.log(`=== INTERVAL INFO ===`);
        const count = timeouts.length;
        alt.log(`Total: ${count}`);
    }

    static parse(cmd: string) {
        if (cmd.includes('timerinfo')) {
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
