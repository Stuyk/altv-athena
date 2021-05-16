import * as alt from 'alt-client';
import { BaseHUD } from '../hud';
import { PhoneEventList } from '../../../../shared/enums/phoneEvents';
import { isAnyMenuOpen } from '../../../utility/menus';
import { VehicleAppController } from './apps/vehicleApp';
import { BankAppController } from './apps/bankApp';
import { DealershipAppController } from './apps/dealershipApp';
import { KeybindController } from '../../../events/keyup';
import { KEY_BINDS } from '../../../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';

export class PhoneController {
    /**
     * Register the keybind to toggle the phone.
     * @static
     * @memberof PhoneController
     */
    static registerKeybind() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.PHONE,
            singlePress: PhoneController.togglePhone
        });
    }

    /**
     * Initialized additional applications in the phone interface.
     * @static
     * @memberof PhoneController
     */
    static initializeApps() {
        // Initialize Apps
        VehicleAppController.init();
        BankAppController.init();
        DealershipAppController.init();
    }

    static togglePhone() {
        if (isAnyMenuOpen()) {
            return;
        }

        BaseHUD.view.emit('phone:Toggle');
    }

    static updateTime(hour: number, minute: number) {
        if (!BaseHUD.view) {
            return;
        }

        BaseHUD.view.emit('phone:SetData', 'hour', hour);
        BaseHUD.view.emit('phone:SetData', 'minute', minute);
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
        const event = PhoneEventList.find((event) => event.name.toLowerCase().includes(name.toLowerCase()));

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

alt.onceServer(SYSTEM_EVENTS.TICKS_START, PhoneController.registerKeybind);
