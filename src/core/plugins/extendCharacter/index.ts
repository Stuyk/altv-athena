import * as alt from 'alt-server';
import * as ref from '../../shared/interfaces/Character';

// This is an example of how to extend the existing character interface.
declare module 'alt-server' {
    export interface Character extends Partial<ref.Character> {
        someData?: string;
        someOtherData?: string;
    }
}

function somePlayer(player: alt.Player) {
    if (!player.data) {
        return;
    }

    player.data.someData = 'hi';
}
