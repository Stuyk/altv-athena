import { AgendaSystem } from '../../systems/agenda';
import { Identifier } from '../../systems/identifier';
import { ItemFactory } from '../../systems/item';
import { ItemEffects } from '../../systems/itemEffects';
import { PluginSystem } from '../../systems/plugins';
import { SoundSystem } from '../../systems/sound';
import { StorageSystem } from '../../systems/storage';
import { World } from '../../systems/world';

export const systemConst = {
    agenda: AgendaSystem,
    itemFactory: ItemFactory,
    effects: ItemEffects,
    identifier: Identifier,
    plugins: PluginSystem,
    sound: SoundSystem,
    storage: StorageSystem,
    world: World,
};
