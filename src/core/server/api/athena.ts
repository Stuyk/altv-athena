import { VehicleController } from '../../client/systems/vehicle';
import { playerFuncs } from '../extensions/extPlayer';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { Controllers } from '../streamers/controllers';
import { AgendaSystem } from '../systems/agenda';
import { ItemFactory } from '../systems/item';
import ChatController from '../systems/chat';
import { ItemEffects } from '../systems/itemEffects';
import { PluginSystem } from '../systems/plugins';
import { StorageSystem } from '../systems/storage';
import { World } from '../systems/world';

export const Athena = {
    controllers: Controllers,
    player: playerFuncs,
    systems: {
        chat: ChatController,
        agenda: AgendaSystem,
        items: ItemFactory,
        effects: ItemEffects,
        plugins: PluginSystem,
        storage: StorageSystem,
        world: World,
    },
    vehicle: {
        controller: VehicleController,
        funcs: VehicleFuncs,
    },
};
