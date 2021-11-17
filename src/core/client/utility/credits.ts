import * as alt from 'alt-client';
import { CREDIT_ALIGN } from '../../shared/enums/CreditAlign';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import ICredit from '../../shared/interfaces/ICredit';
import { requestScaleForm, Scaleform } from './scaleform';

let scaleform: Scaleform;
let interval: number;
let timeout: number;

export default class Credits {
    static async create(credit: ICredit) {
        await Credits.clear();

        scaleform = await requestScaleForm('OPENING_CREDITS');

        if (!scaleform) {
            scaleform = null;
            return;
        }

        if (!credit.align) {
            credit.align = CREDIT_ALIGN.LEFT;
        }

        scaleform.passFunction('TEST_CREDIT_BLOCK', credit.role, credit.name, credit.align, 0, 50, 1, 5, 10, 10);

        interval = alt.setInterval(() => {
            scaleform.render(0.5, 0.5, 0.71, 0.68);
        }, 0);

        if (credit.duration >= 0) {
            alt.setTimeout(Credits.clear, credit.duration);
        }
    }

    /**
     * Used to clear the last set spinner.
     * @static
     * @memberof Shard
     */
    static clear() {
        if (scaleform) {
            scaleform.destroy();
            scaleform = null;
        }

        if (timeout) {
            alt.clearTimeout(timeout);
            timeout = null;
        }

        if (interval) {
            alt.clearInterval(interval);
            interval = null;
        }
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_CREDITS, Credits.create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_CREDITS_CLEAR, Credits.clear);
