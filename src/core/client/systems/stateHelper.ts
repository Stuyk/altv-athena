import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';
import { WebViewPlayerState } from '@AthenaShared/interfaces/webviewPlayerState.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';

function update() {
    const data: WebViewPlayerState = {
        health: alt.Player.local.health,
        armour: alt.Player.local.armour,
        weapon: alt.Player.local.currentWeapon,
        speed: alt.Player.local.vehicle ? alt.Player.local.vehicle.speed : alt.Player.local.moveSpeed,
        stamina: alt.Player.local.stamina,
        pos: alt.Player.local.pos,
        rot: alt.Player.local.rot,
        micLevel: alt.Player.local.micLevel,
        isTalking: alt.Player.local.isTalking,
        isAiming: alt.Player.local.isAiming,
        inVehicle: alt.Player.local.vehicle ? true : false,
        isDriver: alt.Player.local.seat === 1,
    };

    AthenaClient.webview.emit(SYSTEM_EVENTS.PLAYER_EMIT_PLAYER_STATE, data);
}

function init() {
    alt.setInterval(update, 1);
}

onTicksStart.add(init);
