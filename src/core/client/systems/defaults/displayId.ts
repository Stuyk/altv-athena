import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced.js';

let screenPoint: { x: number; y: number };
let id = -1;

function init(location: typeof screenPoint) {
    screenPoint = location;
    id = alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.IDENTIFICATION_ID) as number;
    alt.everyTick(tick);
    alt.log(`Display ID: ${id}`);
}

function tick() {
    AthenaClient.screen.text.drawText2D(`ID ${id}`, screenPoint, 0.4, new alt.RGBA(255, 255, 255, 150));
}

alt.onServer(SYSTEM_EVENTS.SHOW_SCREEN_PLAYER_ID, init);
