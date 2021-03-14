import * as alt from 'alt-client';

const MaxAttempts = 200;

export function waitFor(func: Function, ...args: any): Promise<boolean> {
    return new Promise((resolve) => {
        let attempts = 0;

        const interval = alt.setInterval(() => {
            if (attempts >= MaxAttempts) {
                alt.clearInterval(interval);
                resolve(false);
                return;
            }

            if (!func(...args)) {
                attempts += 1;
                return;
            }

            alt.clearInterval(interval);
            resolve(true);
        }, 100);
    });
}

export function waitForFalse(func: Function, ...args: any): Promise<boolean> {
    return new Promise((resolve) => {
        let attempts = 0;

        const interval = alt.setInterval(() => {
            if (attempts >= MaxAttempts) {
                alt.clearInterval(interval);
                resolve(false);
                return;
            }

            if (func(...args)) {
                attempts += 1;
                return;
            }

            alt.clearInterval(interval);
            resolve(true);
        }, 100);
    });
}
