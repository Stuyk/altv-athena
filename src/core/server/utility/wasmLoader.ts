import alt from 'alt-server';
import loader from '@assemblyscript/loader';

const AresFunctionsName = 'ares;';
const injections: any = {};
const helpers: Assembly = {};
let memory: any = [];

export interface AresFunctions {
    isDoneLoading(): boolean;
    getName(): number;
    getFinishName(): number;
    getLoadName(): number;
    getDatabaseName(): number;
    AthenaMath: {
        add(v1: number, v2: number): number;
        sub(v1: number, v2: number): number;
        multiply(v1: number, v2: number): number;
        divide(v1: number, v2: number): number;
        isGreater(v1: number, v2: number): boolean;
        isLesser(v1: number, v2: number): boolean;
        fwdX(x: number, z: number): number;
        fwdY(x: number, z: number): number;
        fwdZ(x: number): number;
        distance2d(x1: number, y1: number, x2: number, y2: number): number;
        distance3d(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number;
        random(min: number, max: number): number;
        randomFloor(min: number, max: number): number;
    };
}

interface Assembly {
    __getString?(value: number): string;
}

export interface InjectedStarter {
    deploy: () => void;
    getEvent: () => string;
    getName: () => string;
}

function convert(v1: any, v2: any) {
    let data = helpers.__getString(v1);

    if (process.platform.includes('win')) {
        data = data.replace(/\\/g, '/');
    }

    alt.emit(helpers.__getString(v2), data);
}

export class WASM {
    static imports = {
        'ex.emit': alt.emit,
        'ex.virtualImport': convert
    };

    static getInjections<T>(name: string): T {
        return injections[name] as T;
    }

    static getHelpers(): Assembly {
        return helpers;
    }

    static getFunctions<T>(name: string = AresFunctionsName): T {
        return injections[name] as T;
    }

    static checkMemory(value: number) {
        console.log(memory[value]);
    }

    static async load<T>(buffer: Buffer = null): Promise<T | null> {
        const { exports }: any | null = await loader
            .instantiate(buffer, {
                index: WASM.imports
            })
            .catch((err) => {
                console.error(err);
                return null;
            });

        if (!exports) {
            return null;
        }

        const functions: { [key: string]: any } = { ...exports } as { [key: string]: Function };
        const name = exports.__getString(functions.getName());
        Object.keys(functions).forEach((key) => {
            if (!functions[key]) {
                return;
            }

            if (key.includes('_')) {
                helpers[key] = functions[key];
                return;
            }

            if (key === 'memory') {
                memory = new Uint8Array(functions[key].memory);
                return;
            }

            if (!injections[name]) {
                injections[name] = {};
            }

            injections[name][key] = functions[key];
        });

        return injections[name] as T;
    }
}
