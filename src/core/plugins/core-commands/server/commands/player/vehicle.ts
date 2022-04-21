import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import VehicleFuncs from '../../../../../server/extensions/vehicleFuncs';
import { VehicleSystem } from '../../../../../server/systems/vehicle';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

class VehicleCommands {
    @command('engine', LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_ENGINE, '/engine'), PERMISSIONS.NONE)
    private static engineCommand(player: alt.Player) {
        if (!player || !player.valid || !player.vehicle) return;

        VehicleSystem.toggleEngine(player);
    }

    @command('vehlock', LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_LOCK, '/vehlock'), PERMISSIONS.NONE)
    private static vehicleLockCommand(player: alt.Player) {
        if (!player || !player.valid || !player.vehicle) return;

        VehicleSystem.toggleLock(player);
    }

    @command('togdoor', LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_DOOR, '/togdoor'), PERMISSIONS.NONE)
    private static toggleDoorCommand(player: alt.Player, door: string) {
        if (!player || !player.valid) return;
        if (!door) return;

        const doorIndex = +door;
        if (doorIndex >= 6) return;

        VehicleSystem.toggleDoor(player, doorIndex);
    }

    @command('givevehkey', '/givevehkey [id] - Give key to vehicle to player', PERMISSIONS.NONE)
    private static giveVehicleKeyCommand(player: alt.Player, id: string) {
        if (!player || !player.valid || id === null || id === undefined) {
            Athena.player.emit.message(player, `/givevehkey [id]`);
            return;
        }

        if (!player.vehicle || !player.vehicle.data) {
            Athena.player.emit.message(player, `Must be in a vehicle you own.`);
            return;
        }

        if (player.vehicle.data.owner.toString() !== player.data._id.toString()) {
            Athena.player.emit.message(player, `Must be in a vehicle you own.`);
            return;
        }

        const target = Athena.player.get.findByUid(id);
        if (!target) {
            Athena.player.emit.message(player, `Could not find that target player`);
            return;
        }

        VehicleFuncs.createKey(target, player.vehicle);
        Athena.player.emit.notification(player, `Minted Vehicle Key for ${target.data.name}`);
    }
}
