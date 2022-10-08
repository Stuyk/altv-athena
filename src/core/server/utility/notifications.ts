import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { ITextMessageNotification } from '../../shared/interfaces/iTextMessageNotification';

/**
 * Add a regular notification to a player.
 * @param player the player to receive the notification
 * @param text the text to show in the notification
 * @param blinking make the notification blink at start
 */
export function addNotificationFor(player: alt.Player, text: string, blinking = true, showInBriefing = true) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, text, blinking, showInBriefing);
}

/**
 * Add a regular notification to all players.
 * @param text the text to show in the notification
 * @param blinking make the notification blink at start
 */
export function addNotificationForAll(text: string, blinking = true, showInBriefing = true) {
    alt.emitAllClients(SYSTEM_EVENTS.PLAYER_EMIT_NOTIFICATION, text, blinking, showInBriefing);
}

/**
 * Add a text message notification to a player.
 * @param player the player to receive the text message notification
 * @param textMessage the text message configuration
 */
export function addTextMessageNotificationFor(player: alt.Player, textMessage: ITextMessageNotification) {
    alt.emitClient(player, SYSTEM_EVENTS.PLAYER_EMIT_TEXTMSG_NOTIFICATION, textMessage);
}

/**
 * Add a text message notification to all players.
 * @param textMessage the text message configuration
 */
export function addTextMessageNotificationForAll(textMessage: ITextMessageNotification) {
    alt.emitAllClients(SYSTEM_EVENTS.PLAYER_EMIT_TEXTMSG_NOTIFICATION, textMessage);
}
