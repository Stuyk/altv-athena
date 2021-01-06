import alt from 'alt-server';
import loader from '@assemblyscript/loader';
import path from 'path';
import { Database, onReady } from 'simplymongo';
import { makePostRequest } from '../ares/postRequests';

const injections = {};

export interface InjectedFunctions {
    idl(): boolean;
    ii(): Promise<any>;
    bd(url: string, collections: Array<string>, callback: Function): boolean;
}

export interface InjectedStarter {
    start(): Promise<any>;
}

export function getInjections<T>(name: string): T {
    return injections[name] as T;
}

export async function loadWASM<T>(name: string, buffer: Buffer = null): Promise<T | null> {
    if (!buffer) {
        return injections[name] as T;
    }

    const { exports }: any | null = await loader.instantiate(buffer).catch((err) => {
        console.error(err);
        return null;
    });

    if (!exports) {
        return null;
    }

    const functions: { [key: string]: Function } = { ...exports } as { [key: string]: Function };
    const getString = exports.__getString;

    if (functions.idl) {
        injections[name] = {
            idl() {
                return functions.idl();
            },
            ii() {
                const fn = new Function('d', getString(functions.ii()));
                return fn({ path, process });
            },
            bd(mongoURL: string, mongoCollections: Array<string>, callback: Function) {
                const fn = new Function('d', getString(functions.bd()));
                return fn({ alt, callback, onReady, mongoURL, mongoCollections, Database, env: process.env });
            }
        };
    }

    if (functions.start) {
        injections[name] = {
            start() {
                const fn = new Function('d', getString(functions.start()));
                return fn({ alt, isWindows: process.platform.includes('win'), makePostRequest });
            }
        };
    }

    return injections[name] as T;
}
