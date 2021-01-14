import * as alt from 'alt-server';
import { System_Events_Notification } from '../../../shared/enums/system';

export function showNotification(message: string): void {
    const p: alt.Player = this as alt.Player;
    p.emit(System_Events_Notification.ShowNotification, message);
}
