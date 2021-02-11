import * as alt from 'alt-server';
import { Vehicle_Events } from '../../shared/enums/vehicle';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand('seatbelt', '/seatbelt - Put on a seatbelt or helmet', Permissions.None, handleCommand);
ChatController.addAliases('seatbelt', ['sb']);

function handleCommand(player: alt.Player): void {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    if (player.data.isDead) {
        return;
    }

    playerFuncs.emit.sound2D(player, 'seatbelt_on', 0.75);
    playerFuncs.emit.notification(player, `You put on your seatbelt.`);
    alt.emitClient(player, Vehicle_Events.SET_SEATBELT);
}
