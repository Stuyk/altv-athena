import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { Doors } from '@AthenaShared/information/doors';

Athena.systems.messenger.commands.register('toggledoor', '/toggledoor', ['admin'], (player: alt.Player) => {
    const doorsByDistance = Doors.sort((a, b) => {
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

    Athena.controllers.doors.update(closestDoor.uid, !closestDoor.isUnlocked);
    Athena.player.emit.message(player, `Toggling Door ${closestDoor.uid}. Unlocked: ${closestDoor.isUnlocked}`);
});
