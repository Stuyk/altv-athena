import { VEHICLE_CLASS } from '../../../../shared/enums/vehicleTypeFlags';
import { VehicleData } from '../../../../shared/information/vehicles';
import { IDealership } from '../../shared/interfaces';
import { DealershipView } from './view';

const dealerships: Array<IDealership> = [
    {
        uid: 'muscle-1',
        name: 'Muscle Cars',
        vehiclePosition: { x: -43.83578109741211, y: -1097.210693359375, z: 25.6 },
        cam: { x: -45.301246643066406, y: -1100.4744873046875, z: 25.6 },
        pos: { x: -40.81455993652344, y: -1104.499267578125, z: 25.6 },
        vehicles: VehicleData.filter((x) => x.class === VEHICLE_CLASS.MUSCLE && x.sell),
    },
    {
        uid: 'sport-1',
        name: 'Sports Cars',
        vehiclePosition: { x: -43.83578109741211, y: -1097.210693359375, z: 25.6 },
        cam: { x: -45.301246643066406, y: -1100.4744873046875, z: 25.6 },
        pos: { x: -45.565216064453125, y: -1103.6785888671875, z: 25.6 },
        vehicles: VehicleData.filter((x) => x.class === VEHICLE_CLASS.SPORT && x.sell),
    },
    {
        uid: 'super-1',
        name: 'Super Cars',
        vehiclePosition: { x: -43.83578109741211, y: -1097.210693359375, z: 25.6 },
        cam: { x: -45.301246643066406, y: -1100.4744873046875, z: 25.6 },
        pos: { x: -49.86375427246094, y: -1101.9132080078125, z: 25.6 },
        vehicles: VehicleData.filter((x) => x.class === VEHICLE_CLASS.SUPER && x.sell),
    },
    {
        uid: 'sedan-1',
        name: 'Budget Sedan Cars',
        vehiclePosition: { x: -43.83578109741211, y: -1097.210693359375, z: 25.6 },
        cam: { x: -45.301246643066406, y: -1100.4744873046875, z: 25.6 },
        pos: { x: -52.828433990478516, y: -1097.793701171875, z: 25.6 },
        vehicles: VehicleData.filter((x) => x.class === VEHICLE_CLASS.SEDAN && x.sell),
    },
];

export class DefaultDealerships {
    static init() {
        for (let i = 0; i < dealerships.length; i++) {
            DealershipView.add(dealerships[i]);
        }
    }
}
