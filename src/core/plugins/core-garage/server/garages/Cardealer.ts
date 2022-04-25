import { VEHICLE_TYPE } from '../../../../shared/enums/vehicleTypeFlags';
import { GarageFunctions } from '../src/view';

const garage = {
    position: { x: -61.96483612060547, y: -1117.912109375, z: 26.4322509765625 - 1 },
    type: VEHICLE_TYPE.VEHICLE,
    index: 'cardealer',
    parking: [
        {
            position: { x: -58.97142791748047, y: -1116.6988525390625, z: 26.4322509765625 - 1 },
            rotation: { x: 0, y: 0, z: 0 }
        },
        {
            position: { x: -56.28131866455078, y: -1116.6988525390625, z: 26.4322509765625 - 1 },
            rotation: { x: 0, y: 0, z: 0 }
        },
        {
            position: { x: -53.57802200317383, y: -1116.6988525390625, z: 26.4322509765625 - 1 },
            rotation: { x: 0, y: 0, z: 0 }
        },
        {
            position: { x: -50.597801208496094, y: -1116.6988525390625, z: 26.4322509765625 - 1 },
            rotation: { x: 0, y: 0, z: 0 }
        },
        {
            position: { x: -47.657142639160156, y: -1116.6988525390625, z: 26.4322509765625 - 1 },
            rotation: { x: 0, y: 0, z: 0 }
        },
    ],
};

GarageFunctions.add(garage);
