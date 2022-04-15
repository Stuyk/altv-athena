import { AgendaSystem } from '../../systems/agenda';
import { ItemFactory } from '../../systems/item';
import { ItemEffects } from '../../systems/itemEffects';
import { PluginSystem } from '../../systems/plugins';
import { StorageSystem } from '../../systems/storage';
import { World } from '../../systems/world';

export const systemConst = {
    agenda: AgendaSystem,
    itemFactory: ItemFactory,
    effects: ItemEffects,
    plugins: PluginSystem,
    storage: StorageSystem,
    world: World,
};
