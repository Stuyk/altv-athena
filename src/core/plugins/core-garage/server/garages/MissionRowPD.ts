import { VEHICLE_TYPE } from '../../../../shared/enums/vehicleTypeFlags';
import { GarageFunctions } from '../src/view';

const garage = {
    position: { x: 407.7226257324219, y: -1003.324951171875, z: 28.26 },
    type: VEHICLE_TYPE.VEHICLE,
    index: 'mission-row',
    parking: [
        {
            position: {
                x: 407.5384521484375,
                y: -979.5560302734375,
                z: 29.2630615234375,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -2.226325511932373,
            },
        },
        {
            position: {
                x: 407.3143005371094,
                y: -984.11865234375,
                z: 29.2630615234375,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -2.176851749420166,
            },
        },
        {
            position: {
                x: 407.6439514160156,
                y: -988.6549682617188,
                z: 29.2630615234375,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -2.226325511932373,
            },
        },
        {
            position: {
                x: 407.4065856933594,
                y: -992.5845947265625,
                z: 29.2630615234375,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -2.176851749420166,
            },
        },
        {
            position: {
                x: 407.6571350097656,
                y: -997.89892578125,
                z: 29.2630615234375,
            },
            rotation: {
                x: 0,
                y: 0,
                z: -2.176851749420166,
            },
        },
    ],
};

GarageFunctions.add(garage);
