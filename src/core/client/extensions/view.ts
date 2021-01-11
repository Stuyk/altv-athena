import * as alt from 'alt-client';
import * as native from 'natives';

// Must be a blank index page.
const blankURL = `http://resource/client/views/empty/html/index.html`;

alt.on('disconnect', async () => {
    (await View.getInstance('', false)).destroy();
});

alt.on('connectionComplete', async () => {
    const view = await View.getInstance(blankURL, false, true);
});

export class View extends alt.WebView {
    private static _instance: View;
    private currentEvents: { eventName: string; callback: any }[] = [];
    private cursorCount: number = 0;
    private isClosing: boolean = false;

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
        if (!View._instance) {
            View._instance = new View(url);

            if (isInit) {
                return View._instance;
            }
        }

        View._instance.isVisible = false;

        // Wait for View to close.
        if (View._instance.isClosing) {
            await new Promise((resolve: Function) => {
                const tmpInterval = alt.setInterval(() => {
                    if (View._instance.isClosing) {
                        return;
                    }

                    alt.clearInterval(tmpInterval);
                    resolve();
                }, 5);
            });
        }

        if (blurBackground) {
            native.triggerScreenblurFadeIn(100);
            native.displayRadar(false);
        }

        alt.Player.local.isMenuOpen = true;
        View._instance.url = url;
        View._instance.showCursor(addCursor);
        View._instance.focus();

        // Used to hide the view until it's ready.
        View._instance.on('ready', () => {
            View._instance.isVisible = true;
        });

        return View._instance;
    }

    /**
     * Handle data coming from the WebView.
     * @param  {string} eventName
     * @param  {(...args:any[])=>void} listener
     */
    public on(eventName: string, listener: (...args: any[]) => void) {
        super.on(eventName, listener);

        const index: number = this.currentEvents.findIndex((e) => e.eventName === eventName);
        if (index >= 0) {
            return;
        }

        this.currentEvents.push({ eventName, callback: listener });
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
            this.cursorCount += 1;
            try {
                alt.showCursor(true);
            } catch (err) {}
        } else {
            for (let i = 0; i < this.cursorCount; i++) {
                try {
                    alt.showCursor(false);
                } catch (err) {}
            }

            this.cursorCount = 0;
        }
    }

    /**
     * Closes the WebView and turns off all events.
     */
    public close(delay: number = 0) {
        this.isClosing = true;
        this.url = blankURL;
        this.showCursor(false);
        this.unfocus();
        this.isVisible = false;

        alt.Player.local.isMenuOpen = false;
        native.triggerScreenblurFadeOut(100);
        native.displayRadar(true);

        // Turn off currently existing events.
        for (let i = 0; i < this.currentEvents.length; i++) {
            const eventData = this.currentEvents[i];
            if (eventData.eventName === 'ready') {
                continue;
            }

            super.off(eventData.eventName, eventData.callback);
        }

        this.currentEvents = [];
        alt.setTimeout(() => {
            this.isClosing = false;
        }, delay);
    }
}
