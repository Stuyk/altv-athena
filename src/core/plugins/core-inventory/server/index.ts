import { PluginSystem } from '@AthenaServer/systems/plugins';
import { InventoryView } from './src/view';

const PLUGIN_NAME = 'inventory';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    InventoryView.init();
});
