import { AgendaSystem } from '../../systems/agenda';
import { Identifier } from '../../systems/identifier';
import { ItemFactory } from '../../systems/item';
import { ItemEffects } from '../../systems/itemEffects';
import { addJobCheck, cloneObjective, getPlayerJob, Job } from '../../systems/job';
import { PluginSystem } from '../../systems/plugins';
import { SoundSystem } from '../../systems/sound';
import { StorageSystem } from '../../systems/storage';
import { World } from '../../systems/world';
import { defaultSystemsConst } from './constDefaultSystems';

export const systemConst = {
    agenda: AgendaSystem,
    default: defaultSystemsConst,
    itemFactory: ItemFactory,
    effects: ItemEffects,
    identifier: Identifier,
    job: {
        addJobCheck,
        getPlayerJob,
        cloneObjective,
        instance: Job,
    },
    plugins: PluginSystem,
    sound: SoundSystem,
    storage: StorageSystem,
    world: World,
};
