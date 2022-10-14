import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

const NotificationConst = {
    notification(text: string): void {
        native.beginTextCommandThefeedPost('STRING');
        native.addTextComponentSubstringPlayerName(text);
        native.endTextCommandThefeedPostTicker(false, true);
    },
};

export const Notification = {
    ...NotificationConst,
};

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, NotificationConst.notification);
