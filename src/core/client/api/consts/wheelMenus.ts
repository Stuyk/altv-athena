import { NpcWheelMenu } from '../../menus/npc';
import { ObjectWheelMenu } from '../../menus/object';
import { PlayerWheelMenu } from '../../menus/player';
import { VehicleWheelMenu } from '../../menus/vehicle';

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
