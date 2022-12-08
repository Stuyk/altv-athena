import alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { command } from '@AthenaServer/decorators/commands';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { Doors } from '@AthenaShared/information/doors';

class DoorCommands {
    @command('toggledoor', '/toggledoor - Toggles state of closest door.', PERMISSIONS.ADMIN)
    private static toggleClosetDoor(player: alt.Player) {
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

        Athena.controllers.doors.update(closestDoor.uid, !closestDoor.isUnlocked);
        Athena.player.emit.message(player, `Toggling Door ${closestDoor.uid}. Unlocked: ${!closestDoor.isUnlocked}`);
    }
}
