import * as alt from 'alt-client';
import { BaseHUD } from '../hud';
import { PhoneEventList } from '../../../../shared/enums/phoneEvents';
import { isAnyMenuOpen } from '../../../utility/menus';
import { VehicleAppController } from './apps/vehicleApp';
import { BankAppController } from './apps/bankApp';

export class PhoneController {
    static initializeApps() {
        // Initialize Apps
        VehicleAppController.init();
        BankAppController.init();
    }

    static togglePhone() {
        if (isAnyMenuOpen()) {
            return;
        }

        BaseHUD.view.emit('phone:Toggle');
    }

    /**
     * Routes an event from a phone application.
     * @static
     * @param {string} eventName
     * @param {boolean} isServer
     * @param {...any[]} args
     * @return {*}
     * @memberof PhoneController
     */
    static routeFromPhone(name: string, ...args: any[]) {
        const event = PhoneEventList.find((event) => event.name === name);

        if (!event) {
            alt.logError(`No event for ${name} for Phone Application.`);
            return;
        }

        if (event.isServer) {
            alt.emitServer(event.name, ...args);
            return;
        }

        alt.emit(event.name, ...args);
    }
}
