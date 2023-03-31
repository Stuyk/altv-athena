import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
// import { VehicleSystem } from './vehicle';

const pluginRegistration: Array<{ name: string; callback: Function }> = [];
let callbacks: Array<Function> = [];
let hasInitialized = false;

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
