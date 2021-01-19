import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { getVectorInFrontOfPlayer } from '../utility/vector';
import { CommandsLocale } from '../../shared/locale/commands';
import { Permissions } from '../../shared/flags/permissions';

ChatController.addCommand('vehicle', '/vehicle [name] - Spawn an admin vehicle', Permissions.Admin, handleCommand);
ChatController.addAliases('vehicle', ['getvehicle', 'addvehicle']);

function handleCommand(player: alt.Player, name: string): void {
    if (!name) {
        player.emit().message(ChatController.getDescription('vehicle'));
        return;
    }

    if (player.data.isDead) {
        player.emit().message(CommandsLocale.CANNOT_WHILE_DEAD);
        return;
    }

    const forwardPosition = getVectorInFrontOfPlayer(player, 5);

    try {
        const veh = new alt.Vehicle(name, forwardPosition.x, forwardPosition.y, forwardPosition.z, 0, 0, 0);
        veh.setOwner(player);
        veh.setIntoVehicle(player, -1);
    } catch (err) {
        player.emit().message(CommandsLocale.VEHICLE_MODEL_NOT_VALID);
    }
}
