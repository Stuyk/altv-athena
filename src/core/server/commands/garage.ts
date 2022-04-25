import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { Athena } from '../api/athena';
import { command } from '../decorators/commands';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';

const parkingList = [];

class GarageCommands {
    @command('addparking', '/addparking - Add parking to a temporary list.', PERMISSIONS.ADMIN)
    private static addParkingCommand(player: alt.Player) {
        parkingList.push({ position: player.pos, rotation: player.rot });
        Athena.player.emit.message(player, `Appended parking to temporary list.`);
    }

    @command('removeparking', '/removeparking - Remove last element from parking list.', PERMISSIONS.ADMIN)
    private static removeParkingCommand(player: alt.Player) {
        parkingList.pop();
        Athena.player.emit.message(player, `Removed last element from temporary list.`);
    }

    @command('clearparking', '/clearparking - Clear Temporary List', PERMISSIONS.ADMIN)
    private static clearParkingCommand(player: alt.Player) {
        while (parkingList.length >= 1) {
            parkingList.pop();
        }

        Athena.player.emit.message(player, `Cleared temporary parking list.`);
    }

    @command('printparking', '/printparking - Print Temporary List', PERMISSIONS.ADMIN)
    private static printParkingCommand(player: alt.Player) {
        Athena.player.emit.message(player, `Printed to Server Console`);
        console.log(JSON.stringify(parkingList, null, '\t'));
    }
}
