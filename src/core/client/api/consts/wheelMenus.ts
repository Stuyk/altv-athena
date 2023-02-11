import { NpcWheelMenu } from '@AthenaClient/menus/npc';
import { PlayerWheelMenu } from '@AthenaClient/menus/player';
import { VehicleWheelMenu } from '@AthenaClient/menus/vehicle';

export const wheelMenusConst = {
    ped: {
        add: NpcWheelMenu.addInjection,
    },
    player: {
        add: PlayerWheelMenu.addInjection,
    },
    vehicle: {
        add: VehicleWheelMenu.addInjection,
    },
};
