import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

function getAmmo(uid: string, hash: number) {
    const type = native.getPedAmmoTypeFromWeapon(alt.Player.local.scriptID, hash);
    const ammo = native.getPedAmmoByType(alt.Player.local.scriptID, type);
    alt.emitServer(SYSTEM_EVENTS.PLAYER_EMIT_AMMUNITION_UPDATE, uid, hash, ammo);
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_AMMUNITION_UPDATE, getAmmo);
