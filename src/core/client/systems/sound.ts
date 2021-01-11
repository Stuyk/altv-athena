import * as alt from 'alt-client';
import * as native from 'natives';
import { System_Events_Sound } from '../../shared/enums/system';

alt.onServer(System_Events_Sound.PlaySoundFrontend, handleFrontendSound);

function handleFrontendSound(audioName: string, ref: string): void {
    native.playSoundFrontend(-1, audioName, ref, true);
}
