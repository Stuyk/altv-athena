import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import VehicleFuncs from '../../../../../server/extensions/vehicleFuncs';
import { VehicleSystem } from '../../../../../server/systems/vehicle';
import { VEHICLE_EVENTS } from '../../../../../shared/enums/vehicle';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

const SeatbeltState: Array<{ id: number; vehicle_id: number; state: boolean }> = [];

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

    @command('givevehkey', LocaleController.get(LOCALE_KEYS.COMMAND_GIVE_VEH_KEY, '/givevehkey'), PERMISSIONS.NONE)
    private static giveVehicleKeyCommand(player: alt.Player, id: string) {
        if (!player || !player.valid || id === null || id === undefined) {
            Athena.player.emit.message(player, `/givevehkey [id]`);
            return;
        }

        if (!player.vehicle || !player.vehicle.data) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NOT_OWN_BY_YOU));
            return;
        }

        if (player.vehicle.data.owner.toString() !== player.data._id.toString()) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NOT_OWN_BY_YOU));
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }

        VehicleFuncs.createKey(target, player.vehicle);
        Athena.player.emit.notification(player, `${LocaleController.get(LOCALE_KEYS.VEHICLE_KEY_GIVEN_TO)} ${target.data.name}.`);
    }

    @command('seatbelt', LocaleController.get(LOCALE_KEYS.COMMAND_SEATBELT, '/seatbelt'), PERMISSIONS.NONE)
    private static handleSeatbeltCommand(player: alt.Player): void {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }

        if (player.data.isDead) {
            return;
        }

        let index = SeatbeltState.findIndex((x) => x.vehicle_id === player.vehicle.id && x.id === player.id);
        if (index >= 0) {
            SeatbeltState[index].state = !SeatbeltState[index].state;
        } else {
            SeatbeltState.push({ id: player.id, vehicle_id: player.vehicle.id, state: true });
            index = SeatbeltState.length - 1;
        }

        const currentState = SeatbeltState[index].state;
        if (currentState) {
            Athena.player.emit.sound2D(player, 'seatbelt_on', 0.75);
        } else {
            Athena.player.emit.sound2D(player, 'seatbelt_off', 0.75);
        }

        currentState
            ? Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.PLAYER_SEATBELT_ON))
            : Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.PLAYER_SEATBELT_OFF));

        alt.emitClient(player, VEHICLE_EVENTS.SET_SEATBELT, currentState);
    }
}

function setSeatbeltToFalse(player: alt.Player, vehicle: alt.Vehicle) {
    if (!player || !player.valid || !vehicle || !vehicle.valid) {
        return;
    }

    let index = SeatbeltState.findIndex((x) => x.vehicle_id === vehicle.id && x.id === player.id);
    if (index <= -1) {
        return;
    }

    SeatbeltState[index].state = false;
    alt.emitClient(player, VEHICLE_EVENTS.SET_SEATBELT, SeatbeltState[index].state);
}

alt.on('playerEnteredVehicle', setSeatbeltToFalse);
alt.on('playerLeftVehicle', setSeatbeltToFalse);
