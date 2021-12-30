import * as native from 'natives';
import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '../../shared/enums/system';

// Must be a blank index page.
let _defaultURL = `http://assets/webviews/index.html`;
let _isReady: boolean = false;
let _webview: alt.WebView;
let _currentEvents: { eventName: string; callback: any }[] = [];
let _cursorCount: number = 0;
let _overlays: Array<{ name: string; callback: (isVisible: boolean) => void }> = [];

export class WebViewController {
    /**
     * Sets the URL to use based on current deployment.
     * @static
     * @param {string} url
     * @memberof WebViewController
     */
    static create(url: string) {
        _defaultURL = url;

        if (url.includes('localhost')) {
            console.warn(`Running WebService in Development Mode. Nobody can see these pages but the host computer.`);
        }

        if (!_webview) {
            _webview = new alt.WebView(_defaultURL, false);
            _webview.on('view:Ready', () => {
                _isReady = true;
            });

            _webview.on('play:Sound', (audioName: string, ref: string) => {
                native.playSoundFrontend(-1, audioName, ref, true);
            });

            _webview.on('load', () => {
                alt.log(`WebView has mounted successfully.`);
            });
        }
    }

    /**
     * Components like Chat, HUD, etc. all need to be displayed at once.
     * You can register additional Overlays you want to toggle here.
     *
     * Requires a callback to toggle on / off your page.
     * @static
     * @param {string} pageName
     * @param {(isVisible: boolean) => void} callback
     * @memberof WebViewController
     */
    static registerOverlay(pageName: string, callback: (isVisible: boolean) => void) {
        const index = _overlays.findIndex((x) => x.name === pageName);
        if (index >= 0) {
            _overlays[index] = {
                name: pageName,
                callback,
            };
        } else {
            _overlays.push({
                name: pageName,
                callback,
            });
        }
    }

    /**
     * Trigger this to hide/show all overlays like Chat, HUD, etc.
     * @static
     * @param {boolean} value
     * @memberof WebViewController
     */
    static async setOverlaysVisible(value: boolean) {
        for (let i = 0; i < _overlays.length; i++) {
            _overlays[i].callback(value);
        }
    }

    /**
     * Trigger this to hide/show a specific overlay
     * @static
     * @param {string} pageName
     * @param {boolean} state
     * @memberof WebViewController
     */
    static setOverlayVisible(pageName: string, state: boolean) {
        const index = _overlays.findIndex((page) => page.name === pageName);

        if (index === -1) {
            return;
        }

        _overlays[index].callback(state);
    }

    /**
     * Get the current WebView instance.
     * @static
     * @return {Promise<alt.WebView>}
     * @memberof WebViewController
     */
    static async get(): Promise<alt.WebView> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!_webview) {
                    return;
                }

                if (!_isReady) {
                    return;
                }

                alt.clearInterval(interval);
                return resolve(_webview);
            }, 100);
        });
    }

    /**
     * Destroy the WebView
     * @static
     * @memberof WebViewController
     */
    static dispose() {
        _webview.destroy();
    }

    /**
     * Binds a WebView event once and ensures it is never bound again.
     * @static
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     * @return {*}
     * @memberof WebViewController
     */
    static async on(eventName: string, listener: (...args: any[]) => void) {
        const view = await WebViewController.get();
        const index: number = _currentEvents.findIndex((e) => e.eventName === eventName);
        if (index >= 0) {
            return;
        }

        view.on(eventName, listener);
        _currentEvents.push({ eventName, callback: listener });
    }

    /**
     * Unbinds events from the WebView. Mostly useless.
     * @static
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     * @return {*}
     * @memberof WebViewController
     */
    static async off(eventName: string, listener: (...args: any[]) => void) {
        const view = await WebViewController.get();
        view.off(eventName, listener);

        const index = _currentEvents.findIndex((x) => x.eventName === eventName);
        if (index <= -1) {
            return;
        }

        _currentEvents.splice(index, 1);
    }

    /**
     * Emit an event to the WebView.
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @memberof WebViewController
     */
    static async emit(eventName: string, ...args: any[]) {
        const view = await WebViewController.get();
        view.emit(eventName, ...args);
    }

    /**
     * Opens a page in the internal WebView.
     * Pages are basically pre-creates pages.
     * @static
     * @param {string} pageName
     * @memberof WebViewController
     */
    static async openPages(pageNames: Array<string>) {
        const view = await WebViewController.get();
        view.emit('view:Call', 'setPages', pageNames);
    }

    /**
     * Focus the WebView Instance
     * @static
     * @memberof WebViewController
     */
    static async focus() {
        const view = await WebViewController.get();
        view.focus();
    }

    /**
     * Focus the WebView Instance
     * @static
     * @memberof WebViewController
     */
    static async unfocus() {
        const view = await WebViewController.get();
        view.unfocus();
    }

    /**
     * Show or hide the cursor.
     * @static
     * @param {boolean} state
     * @memberof WebViewController
     */
    static async showCursor(state: boolean) {
        if (state) {
            _cursorCount += 1;
            try {
                alt.showCursor(true);
            } catch (err) {}
        } else {
            for (let i = 0; i < _cursorCount; i++) {
                try {
                    alt.showCursor(false);
                } catch (err) {}
            }

            _cursorCount = 0;
        }
    }

    /**
     * Close a group of pages that may or may not be open.
     * Doesn't really care.
     * @static
     * @param {Array<string>} pageNames
     * @memberof WebViewController
     */
    static async closePages(pageNames: Array<string>) {
        const view = await WebViewController.get();
        view.emit('view:Call', 'closePages', pageNames);
    }
}

alt.onServer(SYSTEM_EVENTS.WEBVIEW_INFO, WebViewController.create);
alt.on('disconnect', WebViewController.dispose);
