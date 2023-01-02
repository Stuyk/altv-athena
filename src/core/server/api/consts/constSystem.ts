import { AgendaSystem } from '@AthenaServer/systems/agenda';
import { Identifier } from '@AthenaServer/systems/identifier';
import { ItemFactory } from '@AthenaServer/systems/item';
import { ItemEffects } from '@AthenaServer/systems/itemEffects';
import { addJobCheck, cloneObjective, getPlayerJob, Job } from '@AthenaServer/systems/job';
import { PluginSystem } from '@AthenaServer/systems/plugins';
import { SoundSystem } from '@AthenaServer/systems/sound';
import { StorageSystem } from '@AthenaServer/systems/storage';
import { World } from '@AthenaServer/systems/world';

export const systemConst = {
    agenda: AgendaSystem,
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
