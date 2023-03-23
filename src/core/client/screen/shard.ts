import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import IShard from '@AthenaShared/interfaces/iShard';

let scaleform: AthenaClient.screen.scaleform.Scaleform;
let interval: number;
let timeout: number;

/**
 * Used to clear the last set spinner.
 *
 * @memberof Shard
 */
export function clear() {
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

/**
 * Create a shard, a shard is essentially the mission passed / mission failed text.
 *
 * @export
 * @param {IShard} shard
 * @return {*}
 */
export async function create(shard: IShard) {
    await clear();

    scaleform = await AthenaClient.screen.scaleform.requestScaleForm('MP_BIG_MESSAGE_FREEMODE');

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
        alt.setTimeout(clear, shard.duration);
    }
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SHARD, create);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_SHARD_CLEAR, clear);
