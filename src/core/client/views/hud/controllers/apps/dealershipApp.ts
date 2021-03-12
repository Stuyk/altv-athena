import * as alt from 'alt-client';
import { PhoneEvents } from '../../../../../shared/enums/phoneEvents';
import { SYSTEM_EVENTS } from '../../../../../shared/enums/system';
import { VehicleData } from '../../../../../shared/information/vehicles';
import { BaseHUD } from '../../hud';

export class DealershipAppController {
    static init() {
        BaseHUD.view.on('phone:Dealership:Populate', DealershipAppController.populate);
    }

    static populate() {
        BaseHUD.view.emit('phone:Dealership:Vehicles', VehicleData);
    }
}
