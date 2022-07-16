import * as alt from 'alt-server';
import { Athena } from '../../../server/api/athena';
import { PluginSystem } from '../../../server/systems/plugins';

const PLUGIN_NAME = 'Testing';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);

    Athena.state.subscribe((entity: alt.Player | alt.Vehicle, key: string, oldValue: any, newValue: any) => {
        if (!(entity instanceof alt.Player)) {
            return;
        }

        alt.logWarning(`Key ${key} | ${oldValue} --> ${newValue}`);
    });
});
