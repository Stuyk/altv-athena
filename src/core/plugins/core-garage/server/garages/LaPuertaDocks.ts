import { VEHICLE_TYPE } from '../../../../shared/enums/vehicleTypeFlags';
import { GarageFunctions } from '../src/view';

const garage = {
    position: { x: -732.739501953125, y: -1311.5386962890625, z: 4.5 },
    type: VEHICLE_TYPE.BOAT,
    index: 'la-puerta-dock',
    parking: [
        {
            position: { x: -727.3632202148438, y: -1325.9879150390625, z: -0.47485408186912537 },
            rotation: { x: 0, y: 0, z: -2.325423002243042 },
        },
        {
            position: { x: -732.301025390625, y: -1333.2147216796875, z: -0.47423142194747925 },
            rotation: { x: 0, y: 0, z: -2.2931277751922607 },
        },
        {
            position: { x: -738.3604736328125, y: -1340.3260498046875, z: -0.47489091753959656 },
            rotation: { x: 0, y: 0, z: -2.3722894191741943 },
        },
        {
            position: { x: -743.4070434570312, y: -1347.7156982421875, z: -0.4748522937297821 },
            rotation: { x: 0, y: 0, z: -2.57260799407959 },
        },
        {
            position: { x: -750.0630493164062, y: -1354.1044921875, z: -0.47412917017936707 },
            rotation: { x: 0, y: 0, z: -2.287832498550415 },
        },
    ],
};

GarageFunctions.add(garage);
