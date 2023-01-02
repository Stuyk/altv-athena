import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { WebViewController } from '@AthenaClient/extensions/view2';
import ViewModel from '@AthenaClient/models/viewModel';

const PAGE_NAME = 'Audio';
let interval;

/**
 * This is a background audio service that hides in CEF to play audio.
 * @class AudioView
 * @implements {ViewModel}
 */
class InternalFunctions implements ViewModel {
    /**
     * Opens the Audio Service to play '.ogg' files.
     * @static
     * @memberof InternalFunctions
     */
    static async open() {
        if (!interval) {
            interval = alt.setInterval(InternalFunctions.handleQueue, 100);
        }

        WebViewController.registerPersistentPage(PAGE_NAME);
    }

    /**
     * Called every 100ms to invoke a dequeue
     * @static
     * @memberof InternalFunctions
     */
    static async handleQueue() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:TriggerQueue`);
    }

    /**
     * Play Audio from Vue Assets
     * @static
     * @param {string} soundName
     * @param {number} pan 0 = 2D
     * @param {number} volume
     * @param {string} soundInstantID, optional unique id to play sound instant
     * @memberof InternalFunctions
     */
    static async handle3DAudio(soundName: string, pan: number, volume: number, soundInstantID?: string) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Play`, soundName, pan, volume, -1, soundInstantID);
    }

    /**
     * Stop Audio
     * @static
     * @param {string} soundName
     * @param {number} pan 0 = 2D
     * @param {number} volume
     * @param {string} soundInstantID, optional unique id to stop instant sound
     * @memberof InternalFunctions
     */
    static async stop3DAudio(soundInstantID?: string) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Stop`, soundInstantID);
    }
}

export class AudioView {
    /**
     * Play an audio from the WebView.
     * Requires a specific name for a file.
     * Do not add '.ogg'.
     * @static
     * @param {string} soundName
     * @param {number} pan
     * @param {number} volume
     * @param {string} soundInstantID, optional unique id to play sound instant
     * @memberof AudioView
     */
    static play3DAudio(soundName: string, pan: number, volume: number, soundInstantID?: string) {
        InternalFunctions.handle3DAudio(soundName, pan, volume, soundInstantID);
    }

    /**
     * Stop current audio
     * @static
     * @param {string} soundName
     * @param {number} pan
     * @param {number} volume
     * @param {string} soundInstantID, optional unique id to stop instant sound
     * @memberof AudioView
     */
    static stop3DAudio(soundInstantID?: string) {
        InternalFunctions.stop3DAudio(soundInstantID);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.open);
