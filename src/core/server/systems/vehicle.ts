import * as alt from 'alt-server';
import { AnimationFlags } from '../../shared/flags/animation';
import { Vehicle_Door_List, Vehicle_Events, Vehicle_Lock_State, Vehicle_State } from '../../shared/enums/vehicle';
import { getPlayersByGridSpace } from '../utility/filters';
import { playerFuncs } from '../extensions/Player';

alt.on('playerEnteredVehicle', handleEnterVehicle);
alt.onClient(Vehicle_Events.SET_LOCK, handleCycleLock);
alt.onClient(Vehicle_Events.SET_DOOR, handleSetDoor);
alt.onClient(Vehicle_Events.SET_ENGINE, handleSetEngine);

function handleEnterVehicle(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    const actualSeat = seat - 1;
    vehicle.setDoorOpen(player, actualSeat, false);
}

function handleSetEngine(player: alt.Player): void {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    const vehicle: alt.Vehicle = player.vehicle;
    vehicle.setEngine(player);
}

function handleCycleLock(player: alt.Player, vehicle: alt.Vehicle): void {
    if (!player || !player.valid) {
        return;
    }

    if (!vehicle || !vehicle.valid) {
        return;
    }

    const lockState = vehicle.cycleLock(player, false);

    playerFuncs.emit.notification(player, `Vehicle Lock Set to ~y~${Vehicle_Lock_State[lockState].replace('_', ' ')}`);

    if (lockState !== Vehicle_Lock_State.LOCKED && lockState !== Vehicle_Lock_State.UNLOCKED) {
        return;
    }

    if (!player.vehicle) {
        playerFuncs.emit.animation(
            player,
            `anim@mp_player_intmenu@key_fob@`,
            'fob_click_fp',
            AnimationFlags.UPPERBODY_ONLY | AnimationFlags.ENABLE_PLAYER_CONTROL,
            -1
        );
    }

    const soundName = lockState === Vehicle_Lock_State.UNLOCKED ? 'car_unlock' : 'car_lock';
    const playersNearPlayer = getPlayersByGridSpace(player, 8);
    playersNearPlayer.forEach((target) => {
        playerFuncs.emit.sound3D(target, soundName, vehicle);
    });
}

function handleSetDoor(player: alt.Player, vehicle: alt.Vehicle, doorIndex: Vehicle_Door_List): void {
    if (!player || !player.valid) {
        return;
    }

    if (!vehicle || !vehicle.valid) {
        return;
    }

    const doorName = `DOOR_${Vehicle_Door_List[doorIndex]}`;
    const oppositeValue = !vehicle.getStreamSyncedMeta(Vehicle_State[doorName]) ? true : false;
    vehicle.setDoorOpen(player, doorIndex, oppositeValue);
}
