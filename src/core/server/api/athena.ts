import { VehicleController } from '../../client/systems/vehicle';
import { playerFuncs } from '../extensions/extPlayer';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { Controllers } from '../streamers/controllers';

export const Athena = {
    player: playerFuncs,
    vehicle: {
        controller: VehicleController,
        funcs: VehicleFuncs,
    },
    controllers: Controllers,
};
