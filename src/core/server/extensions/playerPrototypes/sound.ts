import * as alt from 'alt-server';
import { System_Events_Sound } from '../../../shared/enums/system';

export function playFrontendSoundPrototype(audioName: string, ref: string): void {
    this.emit(System_Events_Sound.PlaySoundFrontend, audioName, ref);
}

export function playCustomSound3DPrototype(audioName: string, target: alt.Entity): void {
    const p: alt.Player = this as alt.Player;
    p.emit(System_Events_Sound.PlaySound3D, target, audioName);
}
