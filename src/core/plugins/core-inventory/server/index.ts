import * as Athena from '@AthenaServer/api/index.js';
import { InventoryView } from './src/view.js';

const PLUGIN_NAME = 'inventory';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    InventoryView.init();
});
