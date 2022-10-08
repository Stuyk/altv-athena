import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ITextMessageNotification } from '../../shared/interfaces/iTextMessageNotification';

/**
 * Show a regular notification.
 * @param text the text to show in the notification
 * @param blinking make the notification blink at start
 * @returns return the unique id of the new notification
 */
export function showNotification(text: string, blinking = false, showInBriefing = true): number {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(text);
    return native.endTextCommandThefeedPostTicker(blinking, showInBriefing);
}

/**
 * Show a text message notification.
 * @param textMessage the text message configuration, max 100 characters
 * @returns return the unique id of the new notification
 */
export function showTextMessage(textMessage: ITextMessageNotification): number {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(textMessage.message);
    const id = native.endTextCommandThefeedPostMessagetext(
        textMessage.notificationIcon,
        textMessage.notificationIcon,
        textMessage.fadeIn || false,
        1,
        textMessage.sender,
        textMessage.subject,
    );
    native.endTextCommandThefeedPostTicker(false, textMessage.showInBriefing || false);
    return id;
}

/**
 * Hide a notification.
 * @param id the id of the notification to hide
 */
export function hide(id: number) {
    native.thefeedRemoveItem(id);
}

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, showNotification);
alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_TEXTMSG_NOTIFICATION, showTextMessage);
