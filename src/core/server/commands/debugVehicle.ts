import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { getVectorInFrontOfPlayer } from '../utility/vector';

import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { playerFuncs } from '../extensions/extPlayer';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { VEHICLE_OWNERSHIP } from '../../shared/flags/vehicleOwnershipFlags';
import { FactionInternalSystem } from '../systems/factionsInternal';

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

ChatController.addCommand(
    'addfactionvehiclebyid',
    '/addfactionvehiclebyid [faction_id] [model]',
    PERMISSIONS.ADMIN,
    handleAddFactionVehicleByID,
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

    const isValidFaction = FactionInternalSystem.find(player.data.faction);

    if (!isValidFaction) {
        playerFuncs.emit.message(player, `Could not find that faction.`);
        return;
    }

    const fwd = getVectorInFrontOfPlayer(player, 5);

    try {
        const veh = VehicleFuncs.tempVehicle(player, model, fwd, new alt.Vector3(0, 0, 0));

        VehicleFuncs.add(
            {
                owner: isValidFaction._id.toString(),
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

function handleAddFactionVehicleByID(player: alt.Player, id: string, model: string): void {
    if (!player.data || !player.data.faction) {
        playerFuncs.emit.message(player, `Must be in a faction to add that vehicle to the faction.`);
        return;
    }

    if (!id) {
        playerFuncs.emit.message(player, `Faction ID was not specified.`);
        return;
    }

    const isValidFaction = FactionInternalSystem.find(id);

    if (!isValidFaction) {
        playerFuncs.emit.message(player, `Could not find that faction.`);
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
                owner: isValidFaction._id.toString(),
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
