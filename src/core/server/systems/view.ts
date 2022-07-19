import * as alt from 'alt-server';
import { WebViewEventNames } from '../../shared/enums/webViewEvents';

export class ServerView {
    /**
     * Emits an event directly to the client's WebView.
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @memberof ServerView
     */
    static emit(player: alt.Player, eventName: string, ...args: any[]) {
        alt.emitClient(player, WebViewEventNames.ON_SERVER, eventName, ...args);
    }
}
