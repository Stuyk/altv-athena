import * as alt from 'alt-client';

const blankURL = `http://resource/client/views/empty/html/index.html`;

export class View extends alt.WebView {
    private static _instance: View;
    private currentEvents: { eventName: string; callback: any }[] = [];
    private cursorCount: number = 0;

    private constructor(url: string, isOverlay: boolean = false) {
        super(url, isOverlay);
    }

    static getInstance(url: string, addCursor: boolean): View {
        if (!View._instance) {
            View._instance = new View(url);
        }

        View._instance.url = url;
        View._instance.showCursor(addCursor);
        View._instance.focus();
        return View._instance;
    }

    public on(eventName: string, listener: (...args: any[]) => void) {
        super.on(eventName, listener);

        const index: number = this.currentEvents.findIndex((e) => e.eventName === eventName);
        if (index >= 0) {
            return;
        }

        this.currentEvents.push({ eventName, callback: listener });
    }

    public emit(eventName: string, ...args: any[]) {
        super.emit(eventName, ...args);
    }

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

    public close() {
        this.url = blankURL;
        this.showCursor(false);
        this.unfocus();

        // Turn off currently existing events.
        for (let i = 0; i < this.currentEvents.length; i++) {
            const eventData = this.currentEvents[i];
            super.off(eventData.eventName, eventData.callback);
        }
    }
}
