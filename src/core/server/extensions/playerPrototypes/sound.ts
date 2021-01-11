import { System_Events_Sound } from '../../../shared/enums/system';

export function playFrontendSoundPrototype(audioName: string, ref: string): void {
    this.emit(System_Events_Sound.PlaySoundFrontend, audioName, ref);
}
