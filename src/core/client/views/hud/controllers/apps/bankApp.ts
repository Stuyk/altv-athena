import * as alt from 'alt-client';
import { PhoneEvents } from '../../../../../shared/enums/phoneEvents';
import { SYSTEM_EVENTS } from '../../../../../shared/enums/system';
import { BaseHUD } from '../../hud';

alt.on(SYSTEM_EVENTS.META_CHANGED, handleChange);

export class BankAppController {
    static init() {
        // No Initialization Needed at This Time
        BaseHUD.view.on('phone:ATM:Populate', BankAppController.updateCurrency);
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

    BankAppController.updateCurrency();
}
