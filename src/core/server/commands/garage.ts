import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

const parkingList = [];

ChatController.addCommand(
    'addparking',
    '/addparking - Add parking to a temporary list.',
    Permissions.Admin,
    (player: alt.Player) => {
        parkingList.push({ position: player.pos, rotation: player.rot });
        playerFuncs.emit.message(player, `Appended parking to temporary list.`);
    }
);

ChatController.addCommand(
    'removeparking',
    '/removeparking - Remove last element from parking list.',
    Permissions.Admin,
    (player: alt.Player) => {
        parkingList.pop();
        playerFuncs.emit.message(player, `Removed last element from temporary list.`);
    }
);

ChatController.addCommand(
    'clearparking',
    '/clearparking - Clear Temporary List',
    Permissions.Admin,
    (player: alt.Player) => {
        while (parkingList.length >= 1) {
            parkingList.pop();
        }

        playerFuncs.emit.message(player, `Cleared temporary parking list.`);
    }
);

ChatController.addCommand(
    'printparking',
    '/printparking - Print Temporary List',
    Permissions.Admin,
    (player: alt.Player) => {
        playerFuncs.emit.message(player, `Printed to Server Console`);
        console.log(JSON.stringify(parkingList, null, '\t'));
    }
);
