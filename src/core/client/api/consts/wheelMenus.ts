import { NpcWheelMenu } from '@AthenaClient/menus/npc';
import { ObjectWheelMenu } from '@AthenaClient/menus/object';
import { PlayerWheelMenu } from '@AthenaClient/menus/player';
import { VehicleWheelMenu } from '@AthenaClient/menus/vehicle';

export const wheelMenusConst = {
    ped: {
        add: NpcWheelMenu.addInjection,
    },
    player: {
        add: PlayerWheelMenu.addInjection,
    },
    object: {
        add: ObjectWheelMenu.addInjection,
    },
    vehicle: {
        add: VehicleWheelMenu.addInjection,
    },
};
