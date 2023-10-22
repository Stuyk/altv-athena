import { WebViewEventNames } from '../../../src/core/shared/enums/webViewEvents.js';

const OnEvents: { [key: string]: (...args: any[]) => void } = {};

class InternalFunctions {
    /**
     * Initializes `alt.on` forwarders.
     *
     * @static
     * @return {void}
     *
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
     * @return {void}
     *
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
     * @return {void}
     *
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
     * @return {void}
     *
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
     *
     */
    static emitServer<EventNames = string>(eventName: EventNames, ...args: any[]): void {
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
     *
     */
    static emitClient<EventNames = string>(eventName: EventNames, ...args: any[]): void {
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
     *
     */
    static on<EventNames = string, Callback = (...args: any[]) => void>(eventName: EventNames, callback: Callback);
    static on(eventName: string, callback: (...args: any[]) => void) {
        OnEvents[eventName] = callback;
    }

    /**
     * Play a sound from the WebView instance.
     *
     * @static
     * @param {string} soundName
     * @param {number} pan
     * @param {number} volume
     * @param {string} [soundInstantID]
     *
     */
    static playSound(soundName: string, volume: number, soundInstantID?: string) {
        if (!('alt' in window)) {
            console.log(`[CLIENT] -> Sound Emit: ${soundName} ${volume} ${soundInstantID}`);
            return;
        }

        alt.emit(WebViewEventNames.EMIT_CLIENT, WebViewEventNames.PLAY_SOUND, soundName, 0, volume, soundInstantID);
    }

    /**
     * Play a native GTA:V frontend sound
     *
     * @static
     * @param {string} audioName
     * @param {string} ref
     *
     */
    static playSoundFrontend(audioName: string, ref: string) {
        if (!('alt' in window)) {
            console.log(`[CLIENT] -> Frontend Sound Emit: ${audioName} ${ref}`);
            return;
        }

        alt.emit(WebViewEventNames.EMIT_CLIENT, WebViewEventNames.PLAY_SOUND_FRONTEND, audioName, ref);
    }
}

InternalFunctions.init();
