import { MessengerSystem } from '@AthenaServer/systems/messenger';
import { PermissionSystem } from '@AthenaServer/systems/permission';
import { AgendaSystem } from '@AthenaServer/systems/agenda';
import { Identifier } from '@AthenaServer/systems/identifier';
import { ItemFactory } from '@AthenaServer/systems/inventory/factory';
import { ItemEffects } from '@AthenaServer/systems/inventory/effects';
import { addJobCheck, cloneObjective, getPlayerJob, Job } from '@AthenaServer/systems/job';
import { PluginSystem } from '@AthenaServer/systems/plugins';
import { SoundSystem } from '@AthenaServer/systems/sound';
import { defaultSystemsConst } from './constDefaultSystems';
import { ItemManager } from '@AthenaServer/systems/inventory/manager';
import { ItemCrafting } from '@AthenaServer/systems/inventory/crafting';
import { ItemClothing } from '@AthenaServer/systems/inventory/clothing';
import { ItemWeapon } from '@AthenaServer/systems/inventory/weapons';
import { ItemDrops } from '@AthenaServer/systems/inventory/drops';

export const systemConst = {
    agenda: AgendaSystem,
    default: defaultSystemsConst,
    itemClothing: ItemClothing,
    itemDrops: ItemDrops,
    itemFactory: ItemFactory,
    itemManager: ItemManager,
    itemCrafting: ItemCrafting,
    itemWeapon: ItemWeapon,
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
