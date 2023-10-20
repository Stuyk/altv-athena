import alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

Athena.commands.register('toggledoor', '/toggledoor', ['admin'], (player: alt.Player) => {
    const doorsByDistance = Athena.controllers.doors.getDoors().sort((a, b) => {
        const distA = Athena.utility.vector.distance(player.pos, a.pos);
        const distB = Athena.utility.vector.distance(player.pos, b.pos);

        return distA - distB;
    });

    const closestDoor = doorsByDistance[0];
    if (!closestDoor) {
        Athena.player.emit.message(player, 'No doors found.');
        return;
    }

    if (Athena.utility.vector.distance(player.pos, closestDoor.pos) >= 5) {
        Athena.player.emit.message(player, 'No door in reach found.');
        return;
    }

    const result = Athena.controllers.doors.update(closestDoor.uid, !closestDoor.isUnlocked);
    if (!result) {
        Athena.player.emit.message(player, `Failed to toggle door ${closestDoor.uid}`);
        return;
    }

    Athena.player.emit.message(player, `Toggling Door ${closestDoor.uid}. Unlocked: ${closestDoor.isUnlocked}`);
});
