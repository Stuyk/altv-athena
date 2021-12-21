import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import IShard from '../../shared/interfaces/iShard';
import { requestScaleForm, Scaleform } from './scaleform';

let scaleform: Scaleform;
let interval: number;
let timeout: number;

export default class Shard {
    static async create(shard: IShard) {
        await Shard.clear();

        scaleform = await requestScaleForm('MP_BIG_MESSAGE_FREEMODE');

        if (!scaleform) {
            scaleform = null;
            return;
        }

        if (shard.text) {
            scaleform.passFunction('SHOW_SHARD_WASTED_MP_MESSAGE', shard.title, shard.text);
        } else {
            scaleform.passFunction('SHOW_SHARD_WASTED_MP_MESSAGE', shard.title);
        }

        interval = alt.setInterval(() => {
            scaleform.render(0.5, 0.5, 1, 1);
        }, 0);

        if (shard.duration >= 0) {
            alt.setTimeout(Shard.clear, shard.duration);
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

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SHARD, Shard.create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SHARD_CLEAR, Shard.clear);
