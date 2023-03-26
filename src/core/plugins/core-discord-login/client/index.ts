import * as alt from 'alt-client';
import * as AthenaClient from '../../../client/api';
import { DISCORD_LOGIN_EVENTS } from '../shared/events';

let uri: string;

class DiscordLoginView {
    /**
     * Opens the WebView.
     * The function call is from the server-side.
     *
     * @static
     * @param {alt.Player[]} _players
     * @return {void}
     *
     */
    static open(_uri: string) {
        // Originally fetch token was done here... may want to reconsider the quick token system.
        // Need to think about a better implementation.
        // Probably JWT. /shrug

        uri = _uri;
        AthenaClient.webview.ready(DISCORD_LOGIN_EVENTS.PAGE_NAME, DiscordLoginView.ready);

        // Not setting the last value to a 'close' function prevents 'ESCAPE' from being used to close it.
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
        AthenaClient.webview.openPages([DISCORD_LOGIN_EVENTS.PAGE_NAME], true);
        AthenaClient.webview.focus();
        AthenaClient.webview.showCursor(true);
    }

    /**
     * A ready event to send the data up to the WebView.
     *
     * @static
     *
     */
    static ready() {
        AthenaClient.webview.emit(DISCORD_LOGIN_EVENTS.TO_WEBVIEW.SET_URI, uri);
    }

    /**
     * Called when the WebView event is closed.
     *
     * @static
     *
     */
    static close() {
        AthenaClient.webview.closePages([DISCORD_LOGIN_EVENTS.PAGE_NAME]);
        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
        alt.toggleGameControls(true);
        alt.Player.local.isMenuOpen = false;
    }
}

alt.onServer(DISCORD_LOGIN_EVENTS.TO_CLIENT.OPEN, DiscordLoginView.open);
alt.onServer(DISCORD_LOGIN_EVENTS.TO_CLIENT.CLOSE, DiscordLoginView.close);
