import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import { InteractionController } from '../../server/systems/interaction';

alt.on('interaction:DoSomething', doSomeInteracting);

function GenerateInteractions() {
    InteractionController.add({
        event: { eventName: `interaction:DoSomething`, isServer: true },
        type: 'interaction:DoSomething',
        position: { x: 402.397308, y: -1029.67, z: 29.34688 },
        description: 'Browse Heist',
        blip: {
            sprite: 112,
            color: 7,
            shortRange: true,
            text: 'Do Something!',
            pos: { x: 402.397308, y: -1029.67, z: 29.34688 },
            scale: 1
        }
    });
}

function doSomeInteracting(player: alt.Player) {
    playerFuncs.emit.message(player, 'Nice!');
}

// GenerateInteractions();
