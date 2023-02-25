import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';
import { VEHICLE_EVENTS } from '@AthenaShared/enums/vehicle';

const SeatbeltState: Array<{ id: number; vehicle_id: number; state: boolean }> = [];

Athena.systems.messenger.commands.register('engine', '/engine', [], (player: alt.Player) => {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    Athena.vehicle.system.toggleEngine(player);
});

Athena.systems.messenger.commands.register('vehlock', '/vehlock', [], (player: alt.Player) => {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    Athena.vehicle.system.toggleLock(player);
});

Athena.systems.messenger.commands.register(
    'togdoor',
    LocaleController.get(LOCALE_KEYS.COMMAND_TOGGLE_VEH_DOOR, '/togdoor'),
    [],
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

        Athena.vehicle.system.toggleDoor(player, doorIndex);
    },
);

Athena.systems.messenger.commands.register('seatbelt', '/seatbelt', [], (player: alt.Player) => {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return;
    }

    if (data.isDead) {
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
});

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
