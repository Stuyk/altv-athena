import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { getVectorInFrontOfPlayer } from '../utility/vector';

import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { playerFuncs } from '../extensions/Player';
import VehicleFuncs from '../extensions/VehicleFuncs';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { VEHICLE_OWNERSHIP } from '../../shared/flags/VehicleOwnershipFlags';

ChatController.addCommand(
    'vehicle',
    LocaleController.get(LOCALE_KEYS.COMMAND_VEHICLE, '/vehicle'),
    PERMISSIONS.ADMIN,
    handleTemp,
);

ChatController.addCommand(
    'addvehicle',
    LocaleController.get(LOCALE_KEYS.COMMAND_ADD_VEHICLE, '/addvehicle'),
    PERMISSIONS.ADMIN,
    handleAdd,
);

ChatController.addCommand(
    'addfactionvehicle',
    '/addfactionvehicle [model]',
    PERMISSIONS.ADMIN,
    handleAddFactionVehicle,
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
        VehicleFuncs.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));
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
        const veh = VehicleFuncs.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));

        VehicleFuncs.add(
            { owner: player.data._id.toString(), fuel: 100, model, position: veh.pos, rotation: veh.rot },
            false,
        );
        veh.destroy();
    } catch (err) {
        console.log(err);
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.INVALID_VEHICLE_MODEL));
        return;
    }
}

function handleAddFactionVehicle(player: alt.Player, model: string): void {
    if (!player.data || !player.data.faction) {
        playerFuncs.emit.message(player, `Must be in a faction to add that vehicle to the faction.`);
        return;
    }

    if (!model) {
        playerFuncs.emit.message(player, `Vehicle model not specified`);
        return;
    }

    if (player.data.isDead) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD));
        return;
    }

    const fwd = getVectorInFrontOfPlayer(player, 5);

    try {
        const veh = VehicleFuncs.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));

        VehicleFuncs.add(
            {
                owner: player.data.faction.toString(),
                ownerType: VEHICLE_OWNERSHIP.FACTION,
                fuel: 100,
                model,
                position: veh.pos,
                rotation: veh.rot,
            },
            false,
        );

        veh.destroy();
    } catch (err) {
        console.log(err);
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.INVALID_VEHICLE_MODEL));
        return;
    }
}
