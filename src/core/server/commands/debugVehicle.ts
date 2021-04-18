import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { getVectorInFrontOfPlayer } from '../utility/vector';

import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import { vehicleFuncs } from '../extensions/Vehicle';
import { Vehicle } from '../../shared/interfaces/Vehicle';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

ChatController.addCommand(
    'vehicle',
    LocaleController.get(LOCALE_KEYS.COMMAND_VEHICLE, '/vehicle'),
    Permissions.Admin,
    handleTemp
);

ChatController.addCommand(
    'addvehicle',
    LocaleController.get(LOCALE_KEYS.COMMAND_ADD_VEHICLE, '/addvehicle'),
    Permissions.Admin,
    handleAdd
);

ChatController.addCommand(
    'spawnvehicle',
    LocaleController.get(LOCALE_KEYS.COMMAND_SPAWN_VEHICLE, '/spawnvehicle'),
    Permissions.None,
    handleGet
);

function handleTemp(player: alt.Player, model: string): void {
    if (!model) {
        playerFuncs.emit.message(player, ChatController.getDescription('vehicle'));
        return;
    }

    if (player.data.isDead) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
        return;
    }

    const fwd = getVectorInFrontOfPlayer(player, 5);

    try {
        vehicleFuncs.new.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));
    } catch (err) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.INVALID_VEHICLE_MODEL));
    }
}

function handleAdd(player: alt.Player, model: string): void {
    if (!model) {
        playerFuncs.emit.message(player, ChatController.getDescription('addvehicle'));
        return;
    }

    if (player.data.isDead) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
        return;
    }

    const fwd = getVectorInFrontOfPlayer(player, 5);

    try {
        const veh = vehicleFuncs.new.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));
        vehicleFuncs.new.add(player, { fuel: 100, model, position: veh.pos, rotation: veh.rot });
        veh.destroy();
    } catch (err) {
        console.log(err);
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.INVALID_VEHICLE_MODEL));
        return;
    }
}

function handleGet(player: alt.Player, index: string) {
    const i = parseInt(index);

    if (isNaN(i)) {
        playerFuncs.emit.message(player, ChatController.getDescription('getvehicle'));
        return;
    }

    if (!player.data.vehicles) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PERSONAL_VEHICLES));
        return;
    }

    if (!player.data.vehicles[i]) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_THAT_PERSONAL_VEHICLE));
        return;
    }

    const data = player.data.vehicles[i];
    vehicleFuncs.new.spawn(player, data as Vehicle);
}
