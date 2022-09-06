import { distance, distance2d } from '../../../shared/utility/vector';
import { loadAnimation } from '../../systems/animations';
import { getClosestPlayer, getClosestVehicle } from '../../utility/closest';
import { loadModel } from '../../utility/model';
import { UID } from '../../utility/uid';

export const utilityConst = {
    loadModel: loadModel,
    loadAnimation: loadAnimation,
    distance3D: distance,
    distance2D: distance2d,
    getClosestVehicle,
    getClosestPlayer,
    uid: UID,
};
