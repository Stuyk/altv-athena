import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { VehicleSystem } from '../systems/vehicle';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'engine',
    LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_ENGINE, '/engine'),
    Permissions.None,
    (player: alt.Player) => {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }

        VehicleSystem.toggleEngine(player);
    }
);

ChatController.addCommand(
    'vehlock',
    LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_LOCK, '/vehlock'),
    Permissions.None,
    (player: alt.Player) => {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }

        VehicleSystem.toggleLock(player);
    }
);

ChatController.addCommand(
    'togdoor',
    LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_DOOR, '/togdoor'),
    Permissions.None,
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
    }
);
