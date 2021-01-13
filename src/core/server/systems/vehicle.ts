import * as alt from 'alt-server';
import { Vehicle_Door_List, Vehicle_Events, Vehicle_Lock_State, Vehicle_State } from '../../shared/enums/vehicle';

alt.onClient(Vehicle_Events.SET_LOCK, handleCycleLock);
alt.onClient(Vehicle_Events.SET_DOOR, handleSetDoor);
alt.onClient(Vehicle_Events.SET_ENGINE, handleSetEngine);

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

    const lockState = vehicle.cycleLock(player);
    player.send(`Lock Status: ${Vehicle_Lock_State[lockState]}`);
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
