import * as alt from 'alt-server';

import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import VehicleFuncs from '../extensions/vehicleFuncs';
import ChatController from '../systems/chat';
import { VehicleSystem } from '../systems/vehicle';

ChatController.addCommand(
    'engine',
    LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_ENGINE, '/engine'),
    PERMISSIONS.NONE,
    (player: alt.Player) => {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }

        VehicleSystem.toggleEngine(player);
    },
);

ChatController.addCommand(
    'vehlock',
    LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_LOCK, '/vehlock'),
    PERMISSIONS.NONE,
    (player: alt.Player) => {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }

        VehicleSystem.toggleLock(player);
    },
);

ChatController.addCommand(
    'togdoor',
    LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_DOOR, '/togdoor'),
    PERMISSIONS.NONE,
    (player: alt.Player, door: string) => {
        if (!player || !player.valid) {
            return;
        }

        if (!door) {
            return;
        }

        const doorIndex = +door;
        if (doorIndex >= 6) {
            return;
        }

        VehicleSystem.toggleDoor(player, doorIndex);
    },
);

ChatController.addCommand(
    'givevehkey',
    '/givevehkey [id] - Give key to vehicle to player',
    PERMISSIONS.NONE,
    (player: alt.Player, id: string) => {
        if (!player || !player.valid || id === null || id === undefined) {
            playerFuncs.emit.message(player, `/givevehkey [id]`);
            return;
        }

        if (!player.vehicle || !player.vehicle.data) {
            playerFuncs.emit.message(player, `Must be in a vehicle you own.`);
            return;
        }

        if (player.vehicle.data.owner.toString() !== player.data._id.toString()) {
            playerFuncs.emit.message(player, `Must be in a vehicle you own.`);
            return;
        }

        const target = playerFuncs.get.findByUid(id);
        if (!target) {
            playerFuncs.emit.message(player, `Could not find that target player`);
            return;
        }

        VehicleFuncs.createKey(target, player.vehicle);
        playerFuncs.emit.notification(player, `Minted Vehicle Key for ${target.data.name}`);
    },
);
