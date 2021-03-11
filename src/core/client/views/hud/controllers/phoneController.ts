import * as alt from 'alt-client';
import * as native from 'natives';
import { BaseHUD } from '../hud';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { PhoneEventList, PhoneEvents } from '../../../../shared/enums/phoneEvents';
import { isAnyMenuOpen } from '../../../utility/menus';

alt.on(SYSTEM_EVENTS.META_CHANGED, handleChange);

export class PhoneController {
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

    static updateCurrency() {
        BaseHUD.view.emit('phone:SetData', 'cash', alt.Player.local.meta.cash);
        BaseHUD.view.emit('phone:SetData', 'bank', alt.Player.local.meta.bank);
        BaseHUD.view.emit(PhoneEvents.ATM_PROCESS.name);
    }
}

function handleChange(key: string, newValue: any, oldValue: any) {
    if (key !== 'bank' && key !== 'cash') {
        return;
    }

    if (!BaseHUD.view) {
        return;
    }

    PhoneController.updateCurrency();
}
