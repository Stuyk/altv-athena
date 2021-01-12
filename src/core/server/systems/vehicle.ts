import * as alt from 'alt-server';
import { Vehicle_Door_List, Vehicle_Events, Vehicle_Lock_State, Vehicle_State } from '../../shared/enums/vehicle';

alt.onClient(Vehicle_Events.SET_LOCK, handleCycleLock);
alt.onClient(Vehicle_Events.SET_DOOR, handleSetDoor);

function handleCycleLock(player: alt.Player, vehicle: alt.Vehicle): void {
    if (!player || !player.valid) {
        return;
    }

    if (!vehicle || !vehicle.valid) {
        return;
    }

    const lockState = vehicle.cycleLock(player);
    player.send(`Vehicle Lock Set To: ${Vehicle_Lock_State[lockState]}`);
}

function handleSetDoor(player: alt.Player, vehicle: alt.Vehicle, doorState: Vehicle_Door_List): void {
    if (!player || !player.valid) {
        return;
    }

    if (!vehicle || !vehicle.valid) {
        return;
    }

    const oppositeValue = !vehicle.getStreamSyncedMeta(Vehicle_State[`Door_${Vehicle_Door_List[doorState]}`])
        ? true
        : false;

    vehicle.setDoorOpen(player, doorState, oppositeValue);
}
