import * as alt from 'alt-server';

export async function executeTest<T>(description: string, callback: Function, ...args: any[]): Promise<T> {
    alt.log(`[Test] ${description}`);

    try {
        return callback(...args);
    } catch (err) {
        alt.log(`[TEST FAILED] ${description}`);
        throw err;
    }
}

export async function assert(arg1: any, arg2: any, description: string) {
    if (arg1 !== arg2) {
        alt.log(`[TEST FAILED] ${description}`);
        alt.setTimeout(() => process.exit(1), 100);
        throw new Error(`[TEST FAILED] ${arg1} !== ${arg2}`);
    }

    return true;
}
