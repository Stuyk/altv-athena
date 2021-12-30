import { Timer } from './timers';

const MAX_ATTEMPTS = 200;

export function waitFor(func: Function, ...args: any): Promise<boolean> {
    return new Promise((resolve) => {
        let attempts = 0;

        const interval = Timer.createInterval(
            () => {
                if (attempts >= MAX_ATTEMPTS) {
                    Timer.clearInterval(interval);
                    resolve(false);
                    return;
                }

                if (!func(...args)) {
                    attempts += 1;
                    return;
                }

                Timer.clearInterval(interval);
                resolve(true);
            },
            100,
            'wait.ts',
        );
    });
}

export function waitForFalse(func: Function, ...args: any): Promise<boolean> {
    return new Promise((resolve) => {
        let attempts = 0;

        const interval = Timer.createInterval(
            () => {
                if (attempts >= MAX_ATTEMPTS) {
                    Timer.clearInterval(interval);
                    resolve(false);
                    return;
                }

                if (func(...args)) {
                    attempts += 1;
                    return;
                }

                Timer.clearInterval(interval);
                resolve(true);
            },
            100,
            'wait.ts',
        );
    });
}
