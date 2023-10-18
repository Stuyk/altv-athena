import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system.js';
import { ExtractStringKeys } from '@AthenaShared/utility/extractStringKeys.js';

const pluginRegistration: Array<{ name: string; callback: Function }> = [];
const pluginHooks: { [key: string]: Object } = {};

let callbacks: Array<Function> = [];
let hasInitialized = false;
let hasFinishedLoading = false;

declare global {
    export interface ServerPluginAPI {}
}

async function loadPlugins() {
    const promises = [];

    for (let i = 0; i < pluginRegistration.length; i++) {
        const plugin = pluginRegistration[i];
        if (!plugin || typeof plugin.callback !== 'function') {
            alt.logError(`Could not load plugin with name ${plugin.name}. Callback was incorrect.`);
            continue;
        }

        alt.log(`~lc~Plugin: ~g~${plugin.name}`);
        promises.push(plugin.callback());
    }

    await Promise.all(promises);

    // Load after plugins are initialized...
    // VehicleSystem.init();

    for (let callback of callbacks) {
        callback();
    }

    hasFinishedLoading = true;
    alt.emit(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY);
}

/**
 * Loads all plugins.
 */
export function init(): void {
    if (hasInitialized) {
        return;
    }

    hasInitialized = true;
    loadPlugins();
}

/**
 * Register a callback for a plugin to begin its initialization period.
 * This ensures that your plugin is ALWAYS loaded last.
 * @static
 * @param {Function} callback
 *
 */
export function registerPlugin(name: string, callback: Function) {
    pluginRegistration.push({ name, callback });
}

/**
 * Returns a list of all plugin names that are currently being loaded.
 *
 * @static
 * @return {Array<string>}
 *
 */
export function getPlugins(): Array<string> {
    return pluginRegistration.map((x) => {
        return x.name;
    });
}

/**
 * After plugins are finished loading; call these callbacks.
 * Useful for using 'Athena API' at the top level of a document.
 *
 * @param {Function} callback
 */
export function addCallback(callback: Function) {
    if (!callbacks) {
        callbacks = [];
    }

    callbacks.push(callback);
}

/**
 * Verifies if all plugins are done loading.
 *
 * @return {Promise<void>}
 */
export async function isDoneLoading(): Promise<void> {
    return new Promise((resolve: Function) => {
        const interval = alt.setInterval(() => {
            if (!hasFinishedLoading) {
                return;
            }

            alt.clearInterval(interval);
            resolve();
        }, 100);
    });
}

/**
 * Injects a 'plugin' API into the runtime.
 *
 * The runtime injection can be obtained with `Athena.systems.plugins.use`.
 *
 * See that function for additional information.
 *
 * @export
 * @param {string} pluginName
 * @param {Object} functions
 */
export function addAPI(pluginName: string, functions: Object) {
    if (pluginName.includes(' ')) {
        throw new Error('Plugin name must be plain text and all lowercase. No spaces.');
    }

    pluginName = pluginName.toLowerCase();
    pluginHooks[pluginName] = functions;
}

/**
 * Used to obtain a runtime API and its valid functionality.
 *
 * This makes it so you can 'import' without knowing the plugin pathways.
 *
 * As long as you know the 'plugin name' you can import anything.
 *
 * @export
 * @template K
 * @param {K} apiName
 * @return {Promise<ServerPluginAPI[K]>}
 */
export async function useAPI<K extends ExtractStringKeys<ServerPluginAPI>>(apiName: K): Promise<ServerPluginAPI[K]> {
    await isDoneLoading();

    if (!pluginHooks[apiName]) {
        alt.logWarning(`Plugin hook for ${apiName} is not available.`);
        return undefined;
    }

    return pluginHooks[apiName] as ServerPluginAPI[K];
}
