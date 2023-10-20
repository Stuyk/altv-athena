import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import IShard from '@AthenaShared/interfaces/iShard.js';

let scaleform: AthenaClient.screen.scaleform.Scaleform;
let interval: number;
let timeout: number;

/**
 * Used to clear the last set spinner.
 *
 *
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
 *
 * @param {IShard} shard
 * @return {void}
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
