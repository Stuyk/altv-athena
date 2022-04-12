import * as alt from 'alt-client';
import * as native from 'natives';
import { CREDIT_ALIGN } from '../../shared/enums/creditAlign';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import ICredit from '../../shared/interfaces/iCredit';
import { requestScaleForm, Scaleform } from './scaleform';
import { sleep } from './sleep';

let scaleform: Scaleform;
let interval: number;
let timeout: number;

export default class Credits {
    static async create(credit: ICredit) {
        Credits.clear();

        scaleform = await requestScaleForm('OPENING_CREDITS');

        if (!scaleform) {
            scaleform = null;
            return;
        }

        if (!credit.align) {
            credit.align = CREDIT_ALIGN.LEFT;
        }

        const identifier = 1;

        if (interval) {
            scaleform.passFunction('HIDE', identifier, 1, 3, 1);
            await sleep(3000);
        }

        const [_, x, y] = native.getActiveScreenResolution();

        scaleform.passFunction('SETUP_CREDIT_BLOCK', identifier, 0.0, y / 2, credit.align, 1, 1);
        scaleform.passFunction('ADD_ROLE_TO_CREDIT_BLOCK', identifier, credit.role, 0.0, 4, true, '');
        scaleform.passFunction('ADD_NAMES_TO_CREDIT_BLOCK', identifier, credit.name, 100.1, ';', true);
        scaleform.passFunction('SHOW_CREDIT_BLOCK', identifier, 2, 'X', 1);

        interval = alt.setInterval(() => {
            scaleform.render(0.5, 0.5, 0.71, 0.68);
        }, 0);

        if (credit.duration >= 0) {
            alt.setTimeout(async () => {
                scaleform.passFunction('HIDE', identifier, 1, 3, 1);
                await sleep(3000);
                scaleform.passFunction('REMOVE_ALL');
                Credits.clear();
            }, credit.duration);
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
