import * as native from 'natives';
import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { WebViewEventNames } from '../../shared/enums/webViewEvents';
import { OverlayPageType } from '../../shared/interfaces/webview';

const ReadyEvents: { [pageName: string]: (...args: any[]) => void } = {};
const ClientEvents: { [eventName: string]: (...args: any[]) => void } = {};
const CloseEvents: { [pageName: string]: () => void } = {};

let Pages: Array<{ name: string }> = [];
let OverlayPages: Array<OverlayPageType> = [];
let PersistentPages: Array<string> = [];
let isUpdating = false;

// Must be a blank index page.
let _defaultURL = `http://assets/webviews/index.html`;
let _isReady: boolean = false;
let _webview: alt.WebView;
let _currentEvents: { eventName: string; callback: any }[] = [];
let _cursorCount: number = 0;
let _isDisconnecting = false;

const InternalFunctions = {
    /**
     * Gets all current pages and updates the WebView process.
     *
     * @static
     * @return {*}
     * @memberof InternalFunctions
     */
    async updatePages() {
        const view = await WebViewController.get();
        if (!view) {
            return;
        }

        alt.log(`[Vue] === Updating Pages`);

        // Set Pages
        view.emit(
            WebViewEventNames.SET_PAGES,
            Pages.map((page) => {
                return { name: page.name };
            }),
            'pages',
        );

        // Set Overlays
        view.emit(
            WebViewEventNames.SET_PAGES,
            OverlayPages.filter((x) => !x.isHidden).map((page) => {
                return { name: page.name };
            }),
            'overlays',
        );

        // Set Peristent Pages
        view.emit(
            WebViewEventNames.SET_PAGES,
            PersistentPages.map((pageName) => {
                return { name: pageName };
            }),
            'persistent',
        );
    },

    /**
     * Fowards a WebView event to the specified callback.
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @return {*}
     * @memberof InternalFunctions
     */
    handleClientEvent(eventName: string, ...args: any[]) {
        if (_isDisconnecting) {
            return;
        }

        if (!ClientEvents[eventName]) {
            alt.logWarning(`Event ${eventName} called but not registered with WebViewController.on`);
            return;
        }

        ClientEvents[eventName](...args);
    },

    /**
     * Forwards an event from the WebView to the server.
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @memberof InternalFunctions
     */
    handleServerEvent(eventName: string, ...args: any[]) {
        if (_isDisconnecting) {
            return;
        }

        alt.emitServer(eventName, ...args);
    },

    /**
     * Emits a ready callback from the WebView.
     *
     * @static
     * @param {string} pageName
     * @param {...any[]} args
     * @return {*}
     * @memberof InternalFunctions
     */
    handleReadyEvent(pageName: string, ...args: any[]) {
        if (!ReadyEvents[pageName]) {
            alt.logWarning(`Ready Event for ${pageName} called but not registered with WebViewController.onReady`);
            return;
        }

        ReadyEvents[pageName](...args);
    },

    /**
     * Handles events called from server to be passed straight into the WebView.
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @return {*}
     * @memberof InternalFunctions
     */
    async onServer(eventName: string, ...args: any[]) {
        const view = await WebViewController.get();
        if (!view) {
            return;
        }

        view.emit(WebViewEventNames.ON_EMIT, eventName, ...args);
    },

    /**
     * Mostly used for the 'Escape' key.
     *
     * @static
     * @param {number} key
     * @return {*}
     * @memberof InternalFunctions
     */
    handleKeyDownEvent(key: number) {
        if (key === 27) {
            InternalFunctions.closeNonOverlayPages();
        }
    },

    /**
     * Closes all pages that are not overlay pages.
     *
     * @static
     * @memberof InternalFunctions
     */
    async closeNonOverlayPages() {
        if (isUpdating) {
            await InternalFunctions.isDoneUpdating();
        }

        isUpdating = true;

        const oldLength = Pages.length;
        for (let pageIndex = Pages.length - 1; pageIndex >= 0; pageIndex--) {
            if (!CloseEvents[Pages[pageIndex].name]) {
                continue;
            }

            const pageName = Pages[pageIndex].name;
            if (typeof CloseEvents[pageName] === 'function') {
                CloseEvents[pageName]();
            }

            Pages.splice(pageIndex, 1);
        }

        if (oldLength === Pages.length) {
            isUpdating = false;
            return;
        }

        await WebViewController.setOverlaysVisible(true, true);
        const view = await WebViewController.get();
        if (!view) {
            isUpdating = false;
            return;
        }

        await InternalFunctions.updatePages();
        alt.nextTick(() => {
            isUpdating = false;
        });
    },

    async isDoneUpdating(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (isUpdating) {
                    return;
                }

                alt.clearInterval(interval);
                return resolve();
            }, 50);
        });
    },
};

export const WebViewController = {
    /**
     * Sets the URL to use based on current deployment.
     * @static
     * @param {string} url
     * @memberof WebViewController
     */
    create(url: string) {
        _defaultURL = url;

        if (url.includes('localhost')) {
            console.warn(`Running WebService in Development Mode. Nobody can see these pages but the host computer.`);
        }

        if (!_webview) {
            _webview = new alt.WebView(_defaultURL, false);
            _webview.on(WebViewEventNames.EMIT_CLIENT, InternalFunctions.handleClientEvent);
            _webview.on(WebViewEventNames.EMIT_SERVER, InternalFunctions.handleServerEvent);
            _webview.on(WebViewEventNames.EMIT_READY, InternalFunctions.handleReadyEvent);

            _webview.on('view:Ready', () => {
                _isReady = true;
            });

            _webview.on('play:Sound', (audioName: string, ref: string) => {
                native.playSoundFrontend(-1, audioName, ref, true);
            });

            _webview.on('load', () => {
                alt.log(`WebView has mounted successfully.`);
            });

            _webview.on(WebViewEventNames.CLOSE_PAGE, InternalFunctions.closeNonOverlayPages);
        }
    },

    /**
     * Trigger this to hide/show all overlays like Chat, HUD, etc.
     * @static
     * @param {boolean} value
     * @memberof WebViewController
     */
    async setOverlaysVisible(value: boolean, doNotUpdate = false) {
        for (let i = 0; i < OverlayPages.length; i++) {
            OverlayPages[i].isHidden = !value;

            if (!OverlayPages[i].callback || typeof OverlayPages[i].callback !== 'function') {
                continue;
            }

            if (!value) {
                continue;
            }

            OverlayPages[i].callback(value);
        }

        if (doNotUpdate) {
            return;
        }

        await InternalFunctions.updatePages();
    },

    /**
     * Registers a page that never, ever closes. Ever.
     *
     * @static
     * @param {string} pageName
     * @return {*}
     * @memberof WebViewController
     */
    registerPersistentPage(pageName: string) {
        const index = PersistentPages.findIndex((p) => p === pageName);
        if (index >= 0) {
            return;
        }

        PersistentPages.push(pageName);
    },

    /**
     * Register a Page Overlay such as HUD elements.
     *
     * @static
     * @param {string} pageName
     * @param {(isVisible: boolean) => void} callback
     * @return {*}
     * @memberof WebViewController
     */
    registerOverlay(pageName: string, callback: (isVisible: boolean) => void = undefined) {
        const index = OverlayPages.findIndex((p) => p.name === pageName);
        if (index >= 0) {
            OverlayPages[index].callback = callback;
            return;
        }

        OverlayPages.push({ name: pageName, callback });
        InternalFunctions.updatePages();
    },

    /**
     * Trigger this to hide/show a specific overlay
     *
     * @static
     * @param {string} pageName
     * @param {boolean} state
     * @memberof WebViewController
     */
    setOverlayVisible(pageName: string, state: boolean) {
        const pageIndex = OverlayPages.findIndex((page) => page.name === pageName);
        if (pageIndex === -1) {
            return;
        }

        OverlayPages[pageIndex].isHidden = !state;
        if (typeof OverlayPages[pageIndex].callback !== 'function') {
            return;
        }

        OverlayPages[pageIndex].callback(state);
    },

    /**
     * Get the current WebView instance.
     * @static
     * @return {Promise<alt.WebView>}
     * @memberof WebViewController
     */
    async get(): Promise<alt.WebView> {
        return new Promise((resolve: Function) => {
            let attempts = 0;

            const interval = alt.setInterval(() => {
                if (attempts >= 255) {
                    alt.clearInterval(interval);
                    return resolve(undefined);
                }

                if (!_webview) {
                    attempts += 1;
                    return;
                }

                if (!_isReady) {
                    attempts += 1;
                    return;
                }

                alt.clearInterval(interval);
                return resolve(_webview);
            }, 100);
        });
    },

    /**
     * Destroy the WebView
     * @static
     * @memberof WebViewController
     */
    dispose() {
        _isDisconnecting = true;
        _webview && _webview.valid && _webview.destroy();
    },

    /**
     * Binds a WebView event once and ensures it is never bound again.
     * @static
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     * @return {*}
     * @memberof WebViewController
     */
    async on(eventName: string, listener: (...args: any[]) => void) {
        const view = await WebViewController.get();
        const index: number = _currentEvents.findIndex((e) => e.eventName === eventName);
        if (index >= 0) {
            return;
        }

        view.on(eventName, listener);
        _currentEvents.push({ eventName, callback: listener });
    },

    /**
     * Unbinds events from the WebView. Mostly useless.
     * @static
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     * @return {*}
     * @memberof WebViewController
     */
    async off(eventName: string, listener: (...args: any[]) => void) {
        const view = await WebViewController.get();
        view.off(eventName, listener);

        const index = _currentEvents.findIndex((x) => x.eventName === eventName);
        if (index <= -1) {
            return;
        }

        _currentEvents.splice(index, 1);
    },

    /**
     * Emit an event to the WebView.
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @memberof WebViewController
     */
    async emit(eventName: string, ...args: any[]) {
        const view = await WebViewController.get();
        view.emit(eventName, ...args);
    },

    /**
     * Used to open a page or pages.
     * Use a single page if you have closing callbacks.
     *
     * @static
     * @param {(Array<string> | string)} pageOrPages An array of pages, or a single page name. Case sensitive.
     * @param {() => void} [closeOnEscapeCallback=undefined] An event to call when the page is closed.
     * @return {*}
     * @memberof WebViewController
     */
    async openPages(
        pageOrPages: Array<string> | string,
        hideOverlays: boolean = true,
        closeOnEscapeCallback: () => void = undefined,
    ) {
        if (isUpdating) {
            await InternalFunctions.isDoneUpdating();
        }

        isUpdating = true;

        if (typeof pageOrPages === 'string' && !Array.isArray(pageOrPages)) {
            pageOrPages = [pageOrPages];
        }

        if (hideOverlays) {
            WebViewController.setOverlaysVisible(false, true);
        }

        const pagesToAppend: Array<{ name: string }> = [];
        for (const pageName of pageOrPages) {
            const pageIndex = Pages.findIndex((x) => x.name === pageName);

            // Already opened, not opening twice.
            if (pageIndex <= -1) {
                pagesToAppend.push({
                    name: pageName,
                });
            }

            if (closeOnEscapeCallback) {
                CloseEvents[pageName] = closeOnEscapeCallback;
            }
        }

        if (pagesToAppend.length <= 0) {
            isUpdating = false;
            return;
        }

        Pages = pagesToAppend.concat(Pages);
        const view = await WebViewController.get();
        if (!view) {
            isUpdating = false;
            return;
        }

        await InternalFunctions.updatePages();
        alt.nextTick(() => {
            isUpdating = false;
        });
    },

    /**
     * Focus the WebView Instance
     * @static
     * @memberof WebViewController
     */
    async focus() {
        const view = await WebViewController.get();
        view.focus();
    },

    /**
     * Focus the WebView Instance
     * @static
     * @memberof WebViewController
     */
    async unfocus() {
        const view = await WebViewController.get();
        view.unfocus();
    },

    /**
     * Show or hide the cursor.
     * @static
     * @param {boolean} state
     * @memberof WebViewController
     */
    async showCursor(state: boolean) {
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
    },

    /**
     * Closes an overlay page or pages.
     *
     * @static
     * @param {Array<string>} pageNames
     * @return {*}
     * @memberof WebViewController
     */
    async closeOverlays(pageNames: Array<string>) {
        if (isUpdating) {
            await InternalFunctions.isDoneUpdating();
        }

        let didModify = false;
        for (const pageName of pageNames) {
            for (let pageIndex = OverlayPages.length - 1; pageIndex >= 0; pageIndex--) {
                if (OverlayPages[pageIndex].name !== pageName) {
                    continue;
                }

                didModify = true;
                OverlayPages.splice(pageIndex, 1);
            }
        }

        if (!didModify) {
            isUpdating = false;
            return;
        }

        const view = await WebViewController.get();
        if (!view) {
            isUpdating = false;
            return;
        }

        await InternalFunctions.updatePages();
        alt.nextTick(() => {
            isUpdating = false;
        });
    },

    /**
     * Close a group of pages that may or may not be open.
     *
     * @static
     * @param {Array<string>} pageNames
     * @memberof WebViewController
     */
    async closePages(pageNames: Array<string>, showOverlays = false) {
        if (isUpdating) {
            await InternalFunctions.isDoneUpdating();
        }

        let didModify = false;
        for (const pageName of pageNames) {
            for (let pageIndex = Pages.length - 1; pageIndex >= 0; pageIndex--) {
                if (Pages[pageIndex].name !== pageName) {
                    continue;
                }

                didModify = true;
                Pages.splice(pageIndex, 1);
            }
        }

        if (!didModify) {
            isUpdating = false;
            return;
        }

        if (showOverlays) {
            await WebViewController.setOverlaysVisible(true, true);
        }

        const view = await WebViewController.get();
        if (!view) {
            isUpdating = false;
            return;
        }

        await InternalFunctions.updatePages();
        alt.nextTick(() => {
            isUpdating = false;
        });
    },

    /**
     * Registers an event to call when a component is loaded.
     *
     * @static
     * @param {string} pageName
     * @param {(...args: any[]) => void} callback
     * @memberof WebViewController
     */
    ready(pageName: string, callback: (...args: any[]) => void) {
        ReadyEvents[pageName] = callback;
    },

    /**
     * Registers an event to call when a component is loaded.
     *
     * @static
     * @param {string} pageName
     * @param {(...args: any[]) => void} callback
     * @memberof WebViewController
     */
    onInvoke(eventName: string, callback: (...args: any[]) => void) {
        if (ClientEvents[eventName]) {
            console.warn(
                `[Client] Duplicate Event Name (${eventName}) for Athena.webview.on (WebViewController.onInvoke)`,
            );

            console.warn(`Did not register duplicate event.`);
            return;
        }

        ClientEvents[eventName] = callback;
    },

    /**
     * Emit through the WebViewEvents Helper
     * Ensures that there is a callback event on the other side.
     *
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @memberof WebViewController
     */
    async invoke(eventName: string, ...args: any[]) {
        const view = await WebViewController.get();
        if (!view) {
            return;
        }

        view.emit(WebViewEventNames.ON_EMIT, eventName, ...args);
    },
    /**
     * Returns if a page is currently open.
     *
     * @param {string} pageName
     * @return {boolean}
     */
    isPageOpen(pageName: string): boolean {
        return Pages.findIndex((x) => x.name === pageName) !== -1;
    },
};

alt.on('keyup', InternalFunctions.handleKeyDownEvent);
alt.on('disconnect', WebViewController.dispose);
alt.onceServer(SYSTEM_EVENTS.WEBVIEW_INFO, WebViewController.create);
alt.onServer(WebViewEventNames.ON_SERVER, InternalFunctions.onServer);
