import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';

import ViewModel from '@AthenaClient/models/viewModel.js';
import { WebViewEventNames } from '@AthenaShared/enums/webViewEvents.js';

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
     *
     */
    static async open() {
        if (!interval) {
            interval = alt.setInterval(InternalFunctions.handleQueue, 100);
        }

        AthenaClient.webview.registerPersistentPage(PAGE_NAME);
        AthenaClient.webview.on(WebViewEventNames.PLAY_SOUND, AudioView.play3DAudio);
        AthenaClient.webview.on(WebViewEventNames.PLAY_SOUND_FRONTEND, AthenaClient.systems.sound.frontend);
    }

    /**
     * Called every 100ms to invoke a dequeue
     * @static
     *
     */
    static async handleQueue() {
        const view = await AthenaClient.webview.get();
        view.emit(`${PAGE_NAME}:TriggerQueue`);
    }

    /**
     * Play Audio from Vue Assets
     * @static
     * @param {string} soundName
     * @param {number} pan 0 = 2D
     * @param {number} volume
     * @param {string} soundInstantID, optional unique id to play sound instant
     *
     */
    static async handle3DAudio(soundName: string, pan: number, volume: number, soundInstantID?: string) {
        const view = await AthenaClient.webview.get();
        view.emit(`${PAGE_NAME}:Play`, soundName, pan, volume, -1, soundInstantID);
    }

    /**
     * Stop Audio
     * @static
     * @param {string} soundName
     * @param {number} pan 0 = 2D
     * @param {number} volume
     * @param {string} soundInstantID, optional unique id to stop instant sound
     *
     */
    static async stop3DAudio(soundInstantID?: string) {
        const view = await AthenaClient.webview.get();
        view.emit(`${PAGE_NAME}:Stop`, soundInstantID);
    }
}

export class AudioView {
    static init() {
        InternalFunctions.open();
    }

    /**
     * Play an audio from the WebView.
     * Requires a specific name for a file.
     * Do not add '.ogg'.
     * @static
     * @param {string} soundName
     * @param {number} pan
     * @param {number} volume
     * @param {string} soundInstantID, optional unique id to play sound instant
     *
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
     *
     */
    static stop3DAudio(soundInstantID?: string) {
        InternalFunctions.stop3DAudio(soundInstantID);
    }
}
