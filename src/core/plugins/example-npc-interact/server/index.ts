import * as alt from 'alt-server';
import { Athena } from '../../../server/api/athena';
import { PluginSystem } from '../../../server/systems/plugins';
import { EXAMPLE_NPC_INTERACT } from '../shared/info';

const PLUGIN_NAME = 'Single Shop Ped';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    Athena.controllers.ped.append({
        model: 'mp_m_shopkeep_01',
        pos: { x: 372.4012451171875, y: 326.93890380859375, z: 103.56632995605469 },
        heading: 254.62277221679688,
        uid: `${EXAMPLE_NPC_INTERACT.PREFIX}01`,
    });

    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
