import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vehicle_Door_List, Vehicle_Events, Vehicle_Lock_State, Vehicle_State } from '../../shared/enums/vehicle';
import { AnimationFlags } from '../../shared/flags/animation';
import { Vehicle } from '../../shared/interfaces/Vehicle';
import { playerFuncs } from '../extensions/Player';
import { vehicleFuncs } from '../extensions/Vehicle';
import { getPlayersByGridSpace } from '../utility/filters';
import './fuel';
import '../views/dealership';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

alt.on('playerEnteredVehicle', handleEnterVehicle);
alt.onClient(Vehicle_Events.SET_LOCK, handleCycleLock);
alt.onClient(Vehicle_Events.SET_DOOR, handleSetDoor);
alt.onClient(Vehicle_Events.SET_ENGINE, handleSetEngine);
alt.onClient(SYSTEM_EVENTS.VEHICLES_VIEW_SPAWN, handleSpawn);
alt.onClient(SYSTEM_EVENTS.VEHICLES_VIEW_DESPAWN, handleDespawn);

function handleEnterVehicle(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    const actualSeat = seat - 1;
    vehicleFuncs.setter.doorOpen(vehicle, player, actualSeat, false);
    player.lastEnteredVehicleID = vehicle.id;

    if (!vehicle) {
        return;
    }

    if (!vehicle.behavior) {
        vehicle.destroy();
        return;
    }

    vehicleFuncs.setter.updateFuel(vehicle);
}

function handleSetEngine(player: alt.Player): void {
    if (!player || !player.valid || !player.vehicle) {
        return;
    }

    const vehicle: alt.Vehicle = player.vehicle;
    vehicleFuncs.toggle.engine(vehicle, player);
}

function handleCycleLock(player: alt.Player, vehicle: alt.Vehicle): void {
    if (!player || !player.valid) {
        return;
    }

    if (!vehicle || !vehicle.valid) {
        return;
    }

    const lockState = vehicleFuncs.toggle.lock(vehicle, player, false);

    playerFuncs.emit.notification(
        player,
        LocaleController.get(LOCALE_KEYS.VEHICLE_LOCK_SET_TO, Vehicle_Lock_State[lockState].replace('_', ' '))
    );

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
    vehicleFuncs.setter.doorOpen(vehicle, player, doorIndex, oppositeValue);
}

function handleSpawn(player: alt.Player, index: number) {
    if (!player.data.vehicles) {
        return;
    }

    if (index <= -1) {
        return;
    }

    if (index >= player.data.vehicles.length) {
        return;
    }

    const vehicleData = player.data.vehicles[index];
    if (!vehicleData) {
        return;
    }

    vehicleFuncs.new.spawn(player, vehicleData as Vehicle);
}

function handleDespawn(player: alt.Player) {
    if (!player.data.vehicles) {
        return;
    }

    if (player.lastVehicleID === null || player.lastVehicleID === undefined) {
        return;
    }

    const vehicle = alt.Vehicle.all.find((veh) => veh && veh.id === player.lastVehicleID);
    if (!vehicle) {
        return;
    }

    vehicleFuncs.new.despawn(vehicle.id, player);
}
