import * as alt from 'alt-client';
import { BaseHUD } from '../hud';

export class AudioController {
    /**
     * Play custom 3D audio from the 'sounds' folder.
     * @static
     * @param {string} soundName
     * @param {number} pan
     * @param {number} volume
     * @return {*}  {void}
     * @memberof HUDController
     */
    static handle3DAudio(soundName: string, pan: number, volume: number): void {
        if (!BaseHUD.view) {
            return;
        }

        BaseHUD.view.emit('hud:Audio3D', soundName, pan, volume);
    }
}

alt.on('hud:PlayAudio3D', AudioController.handle3DAudio);
