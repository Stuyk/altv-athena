import * as alt from 'alt-client';
import { ExtractStringKeys } from '@AthenaShared/utility/extractStringKeys.js';

const pluginHooks: { [key: string]: Object } = {};

declare global {
    export interface ClientPluginAPI {}
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
 * @return {Promise<ClientPluginAPI[K]>}
 */
export async function useAPI<K extends ExtractStringKeys<ClientPluginAPI>>(apiName: K): Promise<ClientPluginAPI[K]> {
    if (!pluginHooks[apiName]) {
        alt.logWarning(`Plugin hook for ${apiName} is not available.`);
        return undefined;
    }

    return pluginHooks[apiName] as ClientPluginAPI[K];
}
