import * as Athena from '@AthenaServer/api';
import { InventoryView } from './src/view';

const PLUGIN_NAME = 'inventory';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    InventoryView.init();
});

