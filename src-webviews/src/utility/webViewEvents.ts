import { WebViewEventNames } from '../../../src/core/shared/enums/webViewEvents';

const OnEvents: { [key: string]: (...args: any[]) => void } = {};

class InternalFunctions {
    /**
     * Initializes `alt.on` forwarders.
     *
     * @static
     * @return {*}
     * @memberof InternalFunctions
     */
    static init() {
        if (!('alt' in window)) {
            return;
        }

        alt.on(WebViewEventNames.ON_EMIT, InternalFunctions.handleEmits);
    }

    /**
     * Handles emits from WebViewController.emit
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @return {*}
     * @memberof InternalFunctions
     */
    static handleEmits(eventName: string, ...args: any[]) {
        if (!OnEvents[eventName]) {
            console.warn(`[WebView] Evetn ${eventName} had emit invoked, but has no callback.`);
            return;
        }

        OnEvents[eventName](...args);
    }
}

export default class WebViewEvents {
    /**
     * Closes the WebView page.
     *
     * @static
     * @return {*}
     * @memberof WebViewEvents
     */
    static emitClose() {
        if (!('alt' in window)) {
            console.log(`[CLIENT] -> Tried to Close`);
            return;
        }

        alt.emit(WebViewEventNames.CLOSE_PAGE);
    }

    /**
     * Emits a ready event for a specific page.
     *
     * @static
     * @param {string} pageName
     * @return {*}
     * @memberof WebViewEvents
     */
    static emitReady(pageName: string, ...args: any[]) {
        if (!('alt' in window)) {
            console.log(`[CLIENT] -> Event: Typical Ready Event | ${pageName}}`);
            return;
        }

        alt.emit(WebViewEventNames.EMIT_READY, pageName, ...args);
    }

    /**
     * Emits an event that goes straight to the server.
     * Can be recieved with `alt.onClient`.
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @return {void}
     * @memberof WebViewEvents
     */
    static emitServer(eventName: string, ...args: any[]): void {
        if (!('alt' in window)) {
            console.log(`[SERVER] -> Event: ${eventName} | Args: ${JSON.stringify(args)}`);
            return;
        }

        alt.emit(WebViewEventNames.EMIT_SERVER, eventName, ...args);
    }

    /**
     * Emits an event that goes to the client.
     *
     * Removes the need to do `on` and `off` events.
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @return {void}
     * @memberof WebViewEvents
     */
    static emitClient(eventName: string, ...args: any[]): void {
        if (!('alt' in window)) {
            console.log(`[CLIENT] -> Event: ${eventName} | Args: ${JSON.stringify(args)}`);
            return;
        }

        alt.emit(WebViewEventNames.EMIT_CLIENT, eventName, ...args);
    }

    /**
     * Register an `on` event that gets called when...
     * an event is emitted through WebViewController.
     *
     * @static
     * @param {string} eventName
     * @param {(...args: any[]) => void} callback
     * @memberof WebViewEvents
     */
    static on(eventName: string, callback: (...args: any[]) => void) {
        OnEvents[eventName] = callback;
    }
}

InternalFunctions.init();
