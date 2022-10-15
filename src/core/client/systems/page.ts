import * as alt from 'alt-client';
import * as native from 'natives';
import { AthenaClient } from '@AthenaClient/api/athena';
import { isAnyMenuOpen } from '@AthenaClient/utility/menus';

export interface IPage {
    /**
     * The full name of the Vue file you are trying to load.
     *
     * @type {string}
     * @memberof IPage
     */
    name: string;

    /**
     * Events to call when the page is opened.
     *
     * @memberof IPage
     */
    callbacks: {
        /**
         * Function to call when the View is loaded.
         * Usually used to pass data to the WebView after it's ready.
         */
        onReady: (...args: any[]) => void | Function;
        /**
         * Function to call when the View is closed.
         */
        onClose: (...args: any[]) => void | Function;
    };

    options?: {
        onOpen?: {
            /**
             * Focus the WebView when this page is opened.
             *
             * @type {boolean}
             */
            focus?: boolean;

            /**
             * Show the cursor when the WebView is focused?
             *
             * @type {boolean}
             */
            showCursor?: boolean;

            /**
             * Hide the HUD when the WebView is opened.
             *
             * @type {boolean}
             */
            hideHud?: boolean;

            /**
             * Hide overlays when the WebView is opened.
             *
             * @type {boolean}
             */
            hideOverlays?: boolean;

            /**
             * Disable game controls on open?
             *
             * @type {boolean}
             */
            disableControls?: boolean;

            /**
             * Blur the game.
             *
             * @type {boolean}
             */
            blurBackground?: boolean;

            /**
             * Sets alt.Player.local.isMenuOpen to false if false.
             *
             * @type {boolean}
             */
            setIsMenuOpenToTrue?: boolean;
        };
        onClose?: {
            /**
             * Unfocus the WebView when it is closed?
             *
             * @type {boolean}
             */
            unfocus?: boolean;

            /**
             * Hide the cursor when the WebView is closed?
             *
             * @type {boolean}
             */
            hideCursor?: boolean;

            /**
             * Show the HUD when the WebView is closed?
             *
             * @type {boolean}
             */
            showHud?: boolean;

            /**
             * Show overlays when the WebView is closed?
             *
             * @type {boolean}
             */
            showOverlays?: boolean;

            /**
             * Enable game controls on close.
             *
             * @type {boolean}
             */
            enableControls?: boolean;

            /**
             * Unblur the game.
             *
             * @type {boolean}
             */
            unblurBackground?: boolean;

            /**
             * Sets alt.Player.local.isMenuOpen to false if true.
             *
             * @type {boolean}
             */
            setIsMenuOpenToFalse?: boolean;
        };
    };

    /**
     * An optional hotkey to open this page.
     *
     * @type {number}
     * @memberof IPage
     */
    keybind?: {
        /**
         * JavaScript key code for this keybind.
         *
         * @type {number}
         */
        key: number;

        /**
         * Hold the key for a longer time to open this menu?
         *
         * @type {boolean}
         */
        isLongPress?: boolean;

        /**
         * Use the same hotkey to invoke a close event.
         * @type {boolean}
         */
        useSameKeyToClose?: boolean;
    };
}

export class Page {
    private info: IPage;

    /**
     * Creates a WebView Page Controller
     * @param {IPage} page
     * @memberof Page
     */
    constructor(page: IPage) {
        this.info = page;

        if (this.info.keybind) {
            if (this.info.keybind.isLongPress) {
                AthenaClient.events.keyBinds.registerKeybind({
                    longPress: this.open.bind(this),
                    key: this.info.keybind.key,
                    singlePress: () => {},
                    ignoreMenuAndChatChecks: true,
                });
            } else {
                AthenaClient.events.keyBinds.registerKeybind({
                    singlePress: this.open.bind(this),
                    key: this.info.keybind.key,
                    ignoreMenuAndChatChecks: true,
                });
            }
        }

        AthenaClient.webview.ready(page.name, page.callbacks.onReady);
    }

    /**
     * Open this WebView Page
     *
     * @return {Promise<boolean>}
     * @memberof Page
     */
    async open(): Promise<boolean> {
        if (this.info.keybind && this.info.keybind.useSameKeyToClose) {
            if (AthenaClient.webview.isPageOpen(this.info.name)) {
                this.close(true);
                return false;
            }
        }

        if (isAnyMenuOpen(false)) {
            return false;
        }

        if (alt.isConsoleOpen()) {
            return false;
        }

        if (alt.isMenuOpen()) {
            return false;
        }

        if (this.info.options.onOpen.focus) {
            AthenaClient.webview.focus();
        }

        const hideOverlays = this.info.options.onOpen.hideOverlays === false ? false : true;

        if (this.info.options.onOpen.hideHud) {
            AthenaClient.webview.showOverlays(false);
        }

        if (this.info.options.onOpen.showCursor) {
            AthenaClient.webview.showCursor(true);
        }

        if (this.info.options.onOpen.disableControls) {
            alt.toggleGameControls(false);
        }

        if (this.info.options.onOpen.hideHud) {
            native.displayRadar(false);
            native.displayHud(false);
        }

        if (this.info.options.onOpen.blurBackground) {
            native.triggerScreenblurFadeIn(250);
        }

        if (this.info.options.onOpen.setIsMenuOpenToTrue) {
            alt.Player.local.isMenuOpen = true;
        }

        await AthenaClient.webview.open([this.info.name], hideOverlays, this.close.bind(this));
        return true;
    }

    /**
     * If `isManuallyTriggered` is set to true.
     * This means that the close event is not coming from the 'Escape' key bind.
     * Useful for when you want your own exit functionality for your WebView.
     *
     * @param {boolean} [isManuallyTriggered=false]
     * @memberof Page
     */
    close(isManuallyTriggered = false) {
        const showOverlays = this.info.options.onClose.showOverlays === false ? false : true;

        if (isManuallyTriggered) {
            AthenaClient.webview.close([this.info.name], showOverlays);
        }

        if (!isManuallyTriggered && showOverlays) {
            AthenaClient.webview.showOverlays(true, false);
        }

        if (this.info.options.onClose.hideCursor) {
            AthenaClient.webview.showCursor(false);
        }

        if (this.info.options.onClose.unfocus) {
            AthenaClient.webview.unfocus();
        }

        if (this.info.options.onClose.unblurBackground) {
            native.triggerScreenblurFadeOut(250);
        }

        if (this.info.options.onClose.setIsMenuOpenToFalse) {
            alt.Player.local.isMenuOpen = false;
        }

        if (this.info.options.onClose.showHud) {
            native.displayRadar(true);
            native.displayHud(true);
        }

        if (this.info.options.onClose.enableControls) {
            console.log('open controls :)');
            alt.toggleGameControls(true);
        }

        this.info.callbacks.onClose();
    }
}
