import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';
import { VEHICLE_EVENTS } from '@AthenaShared/enums/vehicle';

const SeatbeltState: Array<{ id: number; vehicle_id: number; state: boolean }> = [];
Athena.systems.messenger.commands.register(
    'vehengine',
    '/vehengine - Toggle Vehicle Engine',
    [],
    (player: alt.Player) => {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }

        Athena.vehicle.asPlayer.toggleEngine(player, player.vehicle);
    },
);

Athena.systems.messenger.commands.register(
    'vehdoor',
    '/vehdoor [0|1|2|3|4|5] - Open / Close a Vehicle Door',
    [],
    async (player: alt.Player, door: string) => {
        const doorNumber = parseInt(door) as 0 | 1 | 2 | 3 | 4 | 5;
        if (isNaN(doorNumber)) {
            return;
        }

        if (doorNumber <= -1 || doorNumber >= 6) {
            return;
        }

        if (!player.vehicle) {
            return;
        }

        let closeVehicle = player.vehicle;
        if (typeof closeVehicle === 'undefined') {
            closeVehicle = await Athena.getters.vehicle.inFrontOf(player, 3);
        }

        if (typeof closeVehicle === 'undefined') {
            Athena.player.emit.notification(player, 'No vehicle in range.');
            return;
        }

        Athena.vehicle.asPlayer.toggleDoor(player, closeVehicle, doorNumber);
    },
);

Athena.systems.messenger.commands.register(
    'vehlock',
    '/vehlock - Toggle Vehicle Lock',
    [],
    async (player: alt.Player) => {
        if (!player || !player.valid || !player.vehicle) {
            return;
        }

        let closeVehicle = player.vehicle;
        if (typeof closeVehicle === 'undefined') {
            closeVehicle = await Athena.getters.vehicle.inFrontOf(player, 3);
        }

        if (typeof closeVehicle === 'undefined') {
            Athena.player.emit.notification(player, 'No vehicle in range.');
            return;
        }

        Athena.vehicle.asPlayer.toggleLock(player, closeVehicle);
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
alt.on('playerDisconnect', (player: alt.Player) => {
    delete SeatbeltState[player.id];
});
