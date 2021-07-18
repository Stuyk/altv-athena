import * as alt from 'alt-server';

import { playerFuncs } from '../../server/extensions/Player';
import { InteractionController } from '../../server/systems/interaction';

function GenerateInteractions() {
    InteractionController.add({
        type: 'interaction:DoSomething',
        position: { x: 402.397308, y: -1029.67, z: 29.34688 },
        description: 'Neato',
        callback: doSomeInteracting
    });
}

function doSomeInteracting(player: alt.Player) {
    playerFuncs.emit.message(player, 'Nice!');
}

// GenerateInteractions();
