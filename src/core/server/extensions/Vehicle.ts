import * as alt from 'alt-server';
import { Vehicle_State } from '../../shared/enums/vehicle';

/**
 * Overwrites the default functionality of vehicles.
 * Uses stream synced meta to fix vehicle controls.
 */

declare module 'alt-server' {
    export interface Vehicle {
        locked: boolean;

        aDoorGet(door: number): boolean;

        /**
         * Attempt to open a vehicle door.
         * @param  {alt.Player} player
         * @param  {number} door
         * @returns boolean
         */
        aDoorOpen(player: alt.Player, door: number): boolean;

        /**
         * Attempt to close a vehicle door.
         * @param  {alt.Player} player
         * @param  {number} door
         * @returns boolean
         */
        aDoorClose(player: alt.Player, door: number): boolean;

        /**
         * Set the lock of a vehicle.
         * @param  {alt.Player} player
         */
        aToggleLock(player: alt.Player);
    }
}

alt.onClient(Vehicle_State.DoorOpen, (player: alt.Player, vehicle: alt.Vehicle, door: number) => {
    vehicle.aDoorOpen(player, door);
});

alt.onClient(Vehicle_State.DoorClose, (player: alt.Player, vehicle: alt.Vehicle, door: number) => {
    vehicle.aDoorClose(player, door);
});
