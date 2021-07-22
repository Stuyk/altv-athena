import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { handleFrontendSound } from '../systems/sound';
import { Timer } from '../utility/timers';

// Must be a blank index page.
const blankURL = `http://resource/client/views/empty/html/index.html`;
let _currentEvents: { eventName: string; callback: any }[] = [];
let _cursorCount: number = 0;
let _isClosing: boolean = false;
let _instance: View;
let _serverURL: string;

alt.on('disconnect', async () => {
    (await View.getInstance('', false)).destroy();
});

alt.on('connectionComplete', async () => {
    const view = await View.getInstance(blankURL, false, true);
});

alt.onServer(SYSTEM_EVENTS.SET_VIEW_URL, (url: string) => {
    _serverURL = url;
});

export class View extends alt.WebView {
    private constructor(url: string, isOverlay: boolean = false) {
        super(url, isOverlay);
        this.isVisible = false;
    }

    /**
     * Return a recycleable WebView instance.
     * @param  {string} url
     * @param  {boolean} addCursor
     */
    static async getInstance(
        url: string,
        addCursor: boolean,
        isInit: boolean = false,
        blurBackground: boolean = false
    ): Promise<View> {
        if (!_instance) {
            _instance = new View(url);

            if (isInit) {
                return _instance;
            }
        }

        _instance.isVisible = false;

        // Wait for View to close.
        if (_isClosing) {
            await new Promise((resolve: Function) => {
                const tmpInterval = Timer.createInterval(() => {
                    if (_isClosing) {
                        return;
                    }

                    Timer.clearInterval(tmpInterval);
                    resolve();
                }, 5);
            });
        }

        if (blurBackground) {
            native.triggerScreenblurFadeIn(100);
            native.displayRadar(false);
        }

        alt.Player.local.isMenuOpen = true;
        _instance.url = url;
        _instance.showCursor(addCursor);
        _instance.focus();

        // Used to hide the view until it's ready.
        _instance.on('play:Sound', handleFrontendSound);

        // Custom Event for WebView Visibility
        _instance.on('ready', () => {
            _instance.isVisible = true;
        });

        _instance.on('load', () => {
            _instance.isVisible = true;
        });

        alt.log(`PICKED URL: ${url}`);

        // Custom WebView URL for data feeds.
        _instance.on('url', () => {
            _instance.emit('url', _serverURL);
        });

        return _instance;
    }

    /**
     * Handle data coming from the WebView.
     * @param  {string} eventName
     * @param  {(...args:any[])=>void} listener
     */
    public on(eventName: string, listener: (...args: any[]) => void) {
        super.on(eventName, listener);

        const index: number = _currentEvents.findIndex((e) => e.eventName === eventName);
        if (index >= 0) {
            return;
        }

        _currentEvents.push({ eventName, callback: listener });
    }

    /**
     * Send data to the WebView instance.
     * @param  {string} eventName
     * @param  {any[]} ...args
     */
    public emit(eventName: string, ...args: any[]) {
        super.emit(eventName, ...args);
    }

    /**
     * Show or hide the cursor to the player.
     * @param  {boolean} state
     */
    public showCursor(state: boolean) {
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
     * Closes the WebView and turns off all events.
     */
    public close(delay: number = 0) {
        _isClosing = true;
        this.url = blankURL;
        this.showCursor(false);
        this.unfocus();
        this.isVisible = false;

        alt.Player.local.isMenuOpen = false;
        native.triggerScreenblurFadeOut(100);
        native.displayRadar(true);

        // Turn off currently existing events.
        for (let i = 0; i < _currentEvents.length; i++) {
            const eventData = _currentEvents[i];
            super.off(eventData.eventName, eventData.callback);
        }

        _currentEvents = [];
        alt.setTimeout(() => {
            _isClosing = false;
        }, delay);
    }
}
