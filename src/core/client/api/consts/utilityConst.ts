import { distance, distance2d } from '@AthenaShared/utility/vector';
import { loadAnimation } from '@AthenaClient/systems/animations';
import { getClosestPlayer, getClosestVehicle } from '@AthenaClient/utility/closest';
import { drawMissionText } from '@AthenaClient/utility/missionText';
import { loadModel } from '@AthenaClient/utility/model';
import { switchToMultiSecondpart } from '@AthenaClient/camera/switch';
import { isEntityBlockingPosition } from '@AthenaClient/world/isEntityBlocking';
import { UID } from '@AthenaShared/utility/uid';

export const utilityConst = {
    loadModel,
    loadAnimation,
    drawMissionText,
    distance3D: distance,
    distance2D: distance2d,
    getClosestVehicle,
    getClosestPlayer,
    isEntityBlockingPosition,
    switchToMultiSecondpart,
    uid: UID,
};
