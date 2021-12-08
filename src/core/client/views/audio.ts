import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';

const PAGE_NAME = 'Audio';
let interval;

/**
 * This is a background audio service that hides in CEF to play audio.
 * @class AudioView
 * @implements {ViewModel}
 */
export class AudioView implements ViewModel {
    static async open() {
        if (!interval) {
            interval = alt.setInterval(AudioView.handleQueue, 100);
        }

        WebViewController.openPages([PAGE_NAME]);
    }

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
     * @memberof AudioView
     */
    static async handle3DAudio(soundName: string, pan: number, volume: number) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Play`, soundName, pan, volume);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, AudioView.open);
