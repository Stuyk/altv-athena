import * as alt from 'alt-client';
import * as native from 'natives';
import { System_Events_Notification } from '../../shared/enums/system';

alt.onServer(System_Events_Notification.ShowNotification, showNotification);

export function showNotification(text: string): void {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandThefeedPostTicker(false, true);
}
