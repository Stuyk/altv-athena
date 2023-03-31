export { Page } from './page';
import * as native from 'natives';
import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { WebViewEventNames } from '@AthenaShared/enums/webViewEvents';
import { OverlayPageType } from '@AthenaShared/interfaces/webview';
import { AudioView } from '@AthenaClient/views/audio';

export type AnyCallback = ((...args: any[]) => void) | ((...args: any[]) => Promise<void>) | Function;

const SkipPageOnEscape: Array<string> = [];
const ReadyEvents: { [pageName: string]: AnyCallback } = {};
const ClientEvents: { [eventName: string]: AnyCallback } = {};
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
     * @return {void}
     *
     */
    async updatePages() {
        const view = await get();
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
     * @return {void}
     *
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
     *
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
     * @return {void}
     *
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
     * @return {void}
     *
     */
    async onServer(eventName: string, ...args: any[]) {
        const view = await get();
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
     * @return {void}
     *
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
     *
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

            if (SkipPageOnEscape.includes(pageName)) {
                continue;
            }

            if (typeof CloseEvents[pageName] === 'function') {
                CloseEvents[pageName]();
            }

            Pages.splice(pageIndex, 1);
        }

        if (oldLength === Pages.length) {
            isUpdating = false;
            return;
        }

        await setOverlaysVisible(true, true);
        const view = await get();
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

/**
 * Sets the URL to use based on current deployment.
 * @static
 * @param {string} url
 *
 */
export function create(url: string) {
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
        AudioView.init();
    }
}

/**
 * Trigger this to hide/show all overlays like Chat, HUD, etc.
 * @static
 * @param {boolean} value
 *
 */
export async function setOverlaysVisible(value: boolean, doNotUpdate = false) {
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
}

/**
 * Registers a page that never, ever closes. Ever.
 *
 * @static
 * @param {string} pageName
 * @return {void}
 *
 */
export function registerPersistentPage(pageName: string) {
    const index = PersistentPages.findIndex((p) => p === pageName);
    if (index >= 0) {
        return;
    }

    PersistentPages.push(pageName);
}

/**
 * Register a Page Overlay such as HUD elements.
 *
 * @static
 * @param {string} pageName
 * @param {(isVisible: boolean) => void} callback
 * @return {void}
 *
 */
export function registerOverlay(pageName: string, callback: (isVisible: boolean) => void = undefined) {
    const index = OverlayPages.findIndex((p) => p.name === pageName);
    if (index >= 0) {
        OverlayPages[index].callback = callback;
        return;
    }

    OverlayPages.push({ name: pageName, callback });
    InternalFunctions.updatePages();
}

/**
 * Trigger this to hide/show a specific overlay
 *
 * @static
 * @param {string} pageName
 * @param {boolean} state
 *
 */
export function setOverlayVisible(pageName: string, state: boolean) {
    const pageIndex = OverlayPages.findIndex((page) => page.name === pageName);
    if (pageIndex === -1) {
        return;
    }

    OverlayPages[pageIndex].isHidden = !state;
    if (typeof OverlayPages[pageIndex].callback !== 'function') {
        return;
    }

    OverlayPages[pageIndex].callback(state);
}

/**
 * Get the current WebView instance.
 * @static
 * @return {Promise<alt.WebView>}
 *
 */
export async function get(): Promise<alt.WebView> {
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
}

/**
 * Destroy the WebView
 * @static
 *
 */
export function dispose() {
    _isDisconnecting = true;
    _webview && _webview.valid && _webview.destroy();
}

/**
 * Used to open a page or pages.
 * Use a single page if you have closing callbacks.
 *
 * @static
 * @param {(Array<string> | string)} pageOrPages An array of pages, or a single page name. Case sensitive.
 * @param {() => void} [closeOnEscapeCallback=undefined] An event to call when the page is closed.
 * @return {void}
 *
 */
export async function openPages(
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
        setOverlaysVisible(false, true);
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
    const view = await get();
    if (!view) {
        isUpdating = false;
        return;
    }

    await InternalFunctions.updatePages();
    alt.nextTick(() => {
        isUpdating = false;
    });
}

/**
 * Focus the WebView Instance
 * @static
 *
 */
export async function focus() {
    const view = await get();
    view.focus();
}

/**
 * Focus the WebView Instance
 * @static
 *
 */
export async function unfocus() {
    const view = await get();
    view.unfocus();
}

/**
 * Show or hide the cursor.
 * @static
 * @param {boolean} state
 *
 */
export async function showCursor(state: boolean) {
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
 * Closes an overlay page or pages.
 *
 * @static
 * @param {Array<string>} pageNames
 * @return {void}
 *
 */
export async function closeOverlays(pageNames: Array<string>) {
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

    const view = await get();
    if (!view) {
        isUpdating = false;
        return;
    }

    await InternalFunctions.updatePages();
    alt.nextTick(() => {
        isUpdating = false;
    });
}

/**
 * Close a group of pages that may or may not be open.
 *
 * @static
 * @param {Array<string>} pageNames
 *
 */
export async function closePages(pageNames: Array<string>, showOverlays = false) {
    if (isUpdating) {
        await InternalFunctions.isDoneUpdating();
    }

    isUpdating = true;

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
        await setOverlaysVisible(true, true);
    }

    const view = await get();
    if (!view) {
        isUpdating = false;
        return;
    }

    await InternalFunctions.updatePages();
    alt.nextTick(() => {
        isUpdating = false;
    });
}

/**
 * Registers an event to call when a component is loaded.
 *
 * @static
 * @param {string} pageName
 * @param {(...args: any[]) => void} callback
 *
 */
export function ready(pageName: string, callback: AnyCallback) {
    ReadyEvents[pageName] = callback;
}

/**
 * Registers an event to call when a component is loaded.
 *
 * @static
 * @param {string} pageName
 * @param {(...args: any[]) => void} callback
 *
 */
export function on<EventNames = string>(eventName: EventNames, callback: AnyCallback) {
    if (ClientEvents[String(eventName)]) {
        console.warn(`[Client] Duplicate Event Name (${eventName}) for Athena.webview.on (WebViewController.onInvoke)`);

        console.warn(`Did not register duplicate event.`);
        return;
    }

    ClientEvents[String(eventName)] = callback;
}

/**
 * Emit through the WebViewEvents Helper
 * Ensures that there is a callback event on the other side.
 *
 * @static
 * @param {string} eventName
 * @param {...any[]} args
 *
 */
export async function emit<EventNames = string>(eventName: EventNames, ...args: any[]) {
    const view = await get();
    if (!view) {
        return;
    }

    view.emit(WebViewEventNames.ON_EMIT, eventName, ...args);
}

/**
 * Returns if a page is currently open.
 *
 * @param {string} pageName
 * @return {boolean}
 */
export function isPageOpen(pageName: string): boolean {
    return Pages.findIndex((x) => x.name === pageName) !== -1;
}

/**
 * Returns whether or not all pages are done closing / opening
 *
 * @return {void}
 */
export function isDoneUpdating() {
    return isUpdating === false;
}

/**
 * Register a page to ignore escape key presence.
 *
 * @param {string} pageName
 * @return {void}
 */
export function disableEscapeKeyForPage(pageName: string) {
    const index = SkipPageOnEscape.findIndex((x) => x === pageName);
    if (index >= 0) {
        return;
    }

    SkipPageOnEscape.push(pageName);
}

/**
 * Checks if any menu is currently open
 *
 *
 * @return {boolean}
 */
export function isAnyMenuOpen(excludeDead = false): boolean {
    if (alt.Player.local.isActionMenuOpen) {
        return true;
    }

    if (!excludeDead) {
        if (alt.Player.local.meta.isDead) {
            return true;
        }
    }

    if (alt.Player.local.isMenuOpen) {
        return true;
    }

    if (alt.Player.local.isWheelMenuOpen) {
        return true;
    }

    if (alt.Player.local.isLeaderboardOpen) {
        return true;
    }

    return false;
}

alt.on('keyup', InternalFunctions.handleKeyDownEvent);
alt.on('disconnect', dispose);
alt.onceServer(SYSTEM_EVENTS.WEBVIEW_INFO, create);
alt.onServer(WebViewEventNames.ON_SERVER, InternalFunctions.onServer);
alt.onServer(WebViewEventNames.CLOSE_PAGES, (pages: Array<string>) => {
    if (pages.length <= 0) {
        InternalFunctions.closeNonOverlayPages();
        return;
    }

    closePages(pages);
});
