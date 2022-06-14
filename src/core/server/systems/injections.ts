import { PlayerInjectionNames } from './injections/player';
import { VehicleInjectionNames } from './injections/vehicles';

type UnknownFunction<ReturnType = void> = (...args: any[]) => ReturnType;

interface Injection {
    [key: string]: Array<UnknownFunction>;
}

const injections: Injection = {};

/**
 * Injections can be classified as functions that will run before, during, or at the end of a function.
 * They're mainly used to extend the existing gamemode without touching core functionality.
 *
 * @export
 * @class Injections
 */
export class Injections {
    /**
     * Adds a callback to be ran during the specified type of injection.
     *
     * @static
     * @template ReturnType
     * @template T
     * @param {string} injectionName
     * @param {T} callback
     * @memberof Injections
     */
    static add(injectionName: string, callback: UnknownFunction) {
        if (!injections[injectionName]) {
            injections[injectionName] = [];
        }

        if (typeof callback !== 'function') {
            throw new Error(`Callback in Injections.add is not of function type.`);
        }

        injections[injectionName].push(callback);
    }

    /**
     * Returns all injections for a specified type.
     *
     * @static
     * @template T
     * @param {string} injectionName
     * @return {(Array<T | Function>)}
     * @memberof Injections
     */
    static get<T>(injectionName: VehicleInjectionNames | PlayerInjectionNames | string): Array<T | UnknownFunction> {
        if (!injections[injectionName]) {
            return [];
        }

        return injections[injectionName];
    }
}
