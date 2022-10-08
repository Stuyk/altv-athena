import { distance, distance2d } from '../../../shared/utility/vector';
import { loadAnimation } from '../../systems/animations';
import { getClosestPlayer, getClosestVehicle } from '../../utility/closest';
import { drawMissionText } from '../../../client/utility/missionText';
import { loadModel } from '../../utility/model';
import { UID } from '../../utility/uid';
import { switchInPlayer } from '../../utility/switch';

export const utilityConst = {
    loadModel,
    loadAnimation,
    drawMissionText,
    distance3D: distance,
    distance2D: distance2d,
    getClosestVehicle,
    getClosestPlayer,
    switchInPlayer,
    uid: UID,
};
