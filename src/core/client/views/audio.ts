import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';

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
     * @memberof InternalFunctions
     */
    static async handle3DAudio(soundName: string, pan: number, volume: number) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Play`, soundName, pan, volume);
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
     * @memberof AudioView
     */
    static play3DAudio(soundName: string, pan: number, volume: number) {
        InternalFunctions.handle3DAudio(soundName, pan, volume);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.open);
