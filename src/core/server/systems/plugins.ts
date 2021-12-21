import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
const pluginRegistration: Array<{ name: string; callback: Function }> = [];

let hasInitialized = false;

function loadPlugins() {
    alt.log(`~lc~=== Loading Plugins ===`);
    for (let i = 0; i < pluginRegistration.length; i++) {
        const plugin = pluginRegistration[i];
        if (!plugin || typeof plugin.callback !== 'function') {
            alt.logError(`Could not load plugin with name ${plugin.name}. Callback was incorrect.`);
            continue;
        }

        plugin.callback();
    }

    alt.log(`~lc~Extra Resources Loaded ~ly~(${pluginRegistration.length})`);
    alt.emit(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY);
}

/**
 * Plugins will only load after all major functionality has been established.
 * @export
 * @class PluginSystem
 */
export class PluginSystem {
    static init() {
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
     * @memberof PluginSystem
     */
    static registerPlugin(name: string, callback: Function) {
        pluginRegistration.push({ name, callback });
    }
}
