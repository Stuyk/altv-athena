import * as alt from 'alt-server';
import { VEHICLE_EVENTS } from '@AthenaShared/enums/vehicle';

export function toggleLock(player: alt.Player, vehicle: alt.Vehicle) {
    //
}

export function toggleEngine(player: alt.Player, vehicle: alt.Vehicle) {
    //
}

export function toggleDoor(player: alt.Player, vehicle: alt.Vehicle) {
    //
}

alt.onClient(VEHICLE_EVENTS.SET_LOCK, toggleLock);
alt.onClient(VEHICLE_EVENTS.SET_ENGINE, toggleEngine);
alt.onClient(VEHICLE_EVENTS.SET_DOOR, toggleDoor);
