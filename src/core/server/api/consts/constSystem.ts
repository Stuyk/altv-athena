import { MessengerSystem } from '@AthenaServer/systems/messenger';
import { PermissionSystem } from '@AthenaServer/systems/permission';
import { AgendaSystem } from '@AthenaServer/systems/agenda';
import { Identifier } from '@AthenaServer/systems/identifier';
import { ItemFactory } from '@AthenaServer/systems/itemFactory';
import { ItemEffects } from '@AthenaServer/systems/itemEffects';
import { addJobCheck, cloneObjective, getPlayerJob, Job } from '@AthenaServer/systems/job';
import { PluginSystem } from '@AthenaServer/systems/plugins';
import { SoundSystem } from '@AthenaServer/systems/sound';
import { defaultSystemsConst } from './constDefaultSystems';
import { ItemManager } from '@AthenaServer/systems/itemManager';
import { ItemCrafting } from '@AthenaServer/systems/itemCrafting';

export const systemConst = {
    agenda: AgendaSystem,
    default: defaultSystemsConst,
    itemFactory: ItemFactory,
    itemManager: ItemManager,
    itemCrafting: ItemCrafting,
    effects: ItemEffects,
    identifier: Identifier,
    job: {
        addJobCheck,
        getPlayerJob,
        cloneObjective,
        instance: Job,
    },
    messenger: MessengerSystem,
    permission: PermissionSystem,
    plugins: PluginSystem,
    sound: SoundSystem,
};
