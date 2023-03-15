import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

/**
 * Create a simple GTA:V Notification.
 *
 * @export
 * @param {string} text
 */
export function create(text: string): void {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandThefeedPostTicker(false, true);
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, create);
