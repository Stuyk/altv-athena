import * as alt from 'alt-client';
import { AthenaClient } from '../../../client/api/athena';
import { ExampleWebViewEvents } from '../shared/viewInfo';

let players: alt.Player[];

class ExampleWebView {
    /**
     * Opens the WebView.
     * The function call is from the server-side.
     *
     * @static
     * @param {alt.Player[]} _players
     * @return {*}
     * @memberof ExampleWebView
     */
    static open(_players: alt.Player[]) {
        players = _players;
        if (AthenaClient.webview.isAnyMenuOpen(true)) {
            return;
        }

        AthenaClient.webview.ready(ExampleWebViewEvents.ViewName, ExampleWebView.ready);
        AthenaClient.webview.open([ExampleWebViewEvents.ViewName]);
        AthenaClient.webview.focus();
        AthenaClient.webview.showCursor(true);
    }

    /**
     * A ready event to send the data up to the WebView.
     *
     * @static
     * @memberof ExampleWebView
     */
    static ready() {
        AthenaClient.webview.emit(ExampleWebViewEvents.ClientToWebView.LOAD_PLAYERS, players);
    }

    /**
     * Called when the WebView event is closed.
     *
     * @static
     * @memberof ExampleWebView
     */
    static close() {
        players = undefined;
        AthenaClient.webview.close([ExampleWebViewEvents.ViewName]);
        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
    }
}

alt.onServer(ExampleWebViewEvents.ClientServer.OPEN, ExampleWebView.open);
