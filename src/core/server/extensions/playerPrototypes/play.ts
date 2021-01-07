import * as alt from 'alt-server';
import { AnimationFlags } from '../../../shared/enums/animation';
import { System_Events_Animation } from '../../../shared/enums/system';

export function playAnimationPrototype(
    dictionary: string,
    name: string,
    flags: AnimationFlags,
    duration: number = -1
): void {
    if (this.data.isDead) {
        alt.logWarning(`[Athena] Cannot play ${dictionary}@${name} while player is dead.`);
        return;
    }

    this.emit(System_Events_Animation.PlayAnimation, dictionary, name, flags, duration);
}
