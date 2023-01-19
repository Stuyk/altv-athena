import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { VehicleSystem } from './vehicle';

const pluginRegistration: Array<{ name: string; callback: Function }> = [];
const callbacks: Array<Function> = [];

let hasInitialized = false;

async function loadPlugins() {
    alt.log(`~lc~=== Loading Plugins ===`);
    const promises = [];

    for (let i = 0; i < pluginRegistration.length; i++) {
        const plugin = pluginRegistration[i];
        if (!plugin || typeof plugin.callback !== 'function') {
            alt.logError(`Could not load plugin with name ${plugin.name}. Callback was incorrect.`);
            continue;
        }

        promises.push(plugin.callback());
    }

    await Promise.all(promises);

    // Load after plugins are initialized...
    VehicleSystem.init();

    for (let callback of callbacks) {
        callback();
    }

    alt.log(`~lc~Extra Resources Loaded ~ly~(${pluginRegistration.length})`);
    alt.emit(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY);
}

/**
 * Plugins will only load after all major functionality has been established.
 * @export
 * @class PluginSystem
 */
export const PluginSystem = {
    /**
     * Loads the plugins.
     */
    init(): void {
        if (hasInitialized) {
            return;
        }

        hasInitialized = true;
        loadPlugins();
    },

    /**
     * Register a callback for a plugin to begin its initialization period.
     * This ensures that your plugin is ALWAYS loaded last.
     * @static
     * @param {Function} callback
     * @memberof PluginSystem
     */
    registerPlugin(name: string, callback: Function) {
        pluginRegistration.push({ name, callback });
    },

    /**
     * Returns a list of all plugin names that are currently being loaded.
     *
     * @static
     * @return {Array<string>}
     * @memberof PluginSystem
     */
    getPlugins(): Array<string> {
        return pluginRegistration.map((x) => {
            return x.name;
        });
    },
    callback: {
        /**
         * After plugins are finished loading; call these callbacks.
         * Useful for using 'Athena API' at the top level of a document.
         *
         * @param {Function} callback
         */
        add(callback: Function) {
            callbacks.push(callback);
        },
    },
};
