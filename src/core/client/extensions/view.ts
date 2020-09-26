import * as alt from 'alt-client';

const url = `http://resource/client/views/empty/html/index.html`;
let cursorCount = 0;
let instance: View;

export class View extends alt.WebView {
    private view: alt.WebView;
    private currentEvents: Array<{ eventName: string; callback: any }> = [];

    constructor(url: string, showCursor: boolean) {
        super(url);

        // Assign Singleton Instance
        if (!instance) {
            instance = this;
        }

        // Create View if Non Existant
        if (!instance.view) {
            instance.view = new alt.WebView(url);
        } else {
            instance.view.url = url;
        }

        if (showCursor) {
            cursorCount += 1;
            try {
                alt.showCursor(true);
            } catch (err) {
                // Do nothing for the error. Just cursor things.
            }
        }
    }

    extOn(eventName: string, listener: (...args: any[]) => void) {
        super.on(eventName, listener);

        const index = this.currentEvents.findIndex((e) => e.eventName === eventName);
        if (index >= 0) {
            return;
        }

        this.currentEvents.push({ eventName, callback: listener });
    }

    close() {
        this.view.url = url;

        // Turn off cursor instances to prevent buggy behavior.
        for (let i = 0; i < cursorCount; i++) {
            try {
                alt.showCursor(false);
            } catch (err) {
                // Do nothing for the error. Just cursor things.
            }
        }

        // Turn off currently existing events.
        for (let i = 0; i < this.currentEvents.length; i++) {
            const eventData = this.currentEvents[i];
            super.off(eventData.eventName, eventData.callback);
        }
    }
}
