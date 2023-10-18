import * as alt from 'alt-server';
import { WebViewEventNames } from '../../shared/enums/webViewEvents.js';

/**
 * Emits an event directly to the client's WebView.
 *
 * @static
 * @param {string} eventName
 * @param {...any[]} args
 *
 */
export function emit(player: alt.Player, eventName: string, ...args: any[]) {
    player.emit(WebViewEventNames.ON_SERVER, eventName, ...args);
}

/**
 * Closes all pages if no pages are specified.
 * If pages are specified it only closes those specific pages.
 *
 * @param {Array<string>} [pages=[]]
 */
export function closePages(player: alt.Player, pages: Array<string> = []) {
    if (typeof pages === 'undefined') {
        pages = [];
    }

    player.emit(WebViewEventNames.CLOSE_PAGES, pages);
}
