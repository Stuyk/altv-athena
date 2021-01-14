import * as alt from 'alt-server';
import {
    Vehicle_Door_List,
    Vehicle_Events,
    Vehicle_Lock_State,
    Vehicle_Lock_States,
    Vehicle_Seat_List,
    Vehicle_State
} from '../../shared/enums/vehicle';

/**
 * Overwrites the default functionality of vehicles.
 * Uses stream synced meta to fix vehicle controls.
 */

declare module 'alt-server' {
    export interface Vehicle {
        athenaLockState: Vehicle_Lock_State;
        engineStatus: boolean;
        keys: Array<string>;
        owner: number;

        /**
         * Eject a player from the vehicle.
         * @param {alt.Player} player
         * @memberof Vehicle
         */
        ejectFromVehicle(player: alt.Player): void;

        /**
         * Give keys to another player.
         * @param {alt.Player} player
         * @memberof Vehicle
         */
        giveKeys(player: alt.Player): boolean;

        /**
         * Check if a player has keys for this vehicle.
         * @param {alt.Player} player
         * @memberof Vehicle
         */
        hasKeys(player: alt.Player): boolean;

        /**
         * Is the player the owner of this vehicle.
         * @param {alt.Player} player
         * @return {*}  {boolean}
         * @memberof Vehicle
         */
        isOwner(player: alt.Player): boolean;

        /**
         * Get the current lock state.
         * @return {boolean}  {boolean}
         * @memberof Vehicle
         */
        getLockState(): Vehicle_Lock_State;

        /**
         * Remove keys from a player.
         * @param {alt.Player} player
         * @memberof Vehicle
         */
        removeKeys(player: alt.Player): boolean;

        /**
         * Toggle whether a door is open or not.
         * True is open.
         * @param {alt.Player} player The player opening the door.
         * @param {Vehicle_Door_List} index
         * @param {boolean} state
         * @memberof Vehicle
         */
        setDoorOpen(player: alt.Player, index: Vehicle_Door_List, state: boolean): void;

        /**
         * Set a player into the vehicle.
         * @param {alt.Player} player
         * @param {Vehicle_Seat_List} seat
         * @memberof Vehicle
         */
        setIntoVehicle(player: alt.Player, seat: Vehicle_Seat_List): void;

        /**
         * Set the lock state of the vehicle.
         * @param {alt.Player} player Player trying to set lock.
         * @memberof Vehicle
         */
        cycleLock(player: alt.Player): Vehicle_Lock_State;

        /**
         * Set the owner of this vehicle.
         * @param {alt.Player} player
         * @memberof Vehicle
         */
        setOwner(player: alt.Player): void;

        /**
         * Toggle the engine on or off.
         * @param {alt.Player} player
         * @memberof Vehicle
         */
        setEngine(player: alt.Player): void;
    }
}

alt.Vehicle.prototype.ejectFromVehicle = function ejectFromVehicle(player: alt.Player): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!player.vehicle || player.vehicle !== v) {
        return;
    }

    player.safeSetPosition(player.pos.x, player.pos.y, player.pos.z);
};

alt.Vehicle.prototype.giveKeys = function giveKeys(target: alt.Player): boolean {
    const v: alt.Vehicle = this as alt.Vehicle;
    const index = v.keys.findIndex((x) => x === target.data._id.toString());
    if (index !== -1) {
        return true;
    }

    v.setStreamSyncedMeta(Vehicle_State.KEYS, v.keys);
    this.keys.push(target.data._id.toString());
    return true;
};

alt.Vehicle.prototype.getLockState = function getLockState(): Vehicle_Lock_State {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (v.athenaLockState === null || v.athenaLockState === undefined) {
        return Vehicle_Lock_State.LOCKED;
    }

    return v.athenaLockState;
};

alt.Vehicle.prototype.hasKeys = function hasKeys(target: alt.Player): boolean {
    const v: alt.Vehicle = this as alt.Vehicle;
    const index = v.keys.findIndex((x: string) => x === target.data._id.toString());
    if (index <= -1) {
        return false;
    }

    return true;
};

alt.Vehicle.prototype.isOwner = function isOwner(target: alt.Player): boolean {
    const v: alt.Vehicle = this as alt.Vehicle;

    // If the vehicle has a null owner. There is no owner.
    if (!v.owner) {
        return true;
    }

    if (v.owner !== target.id) {
        return false;
    }

    return true;
};

alt.Vehicle.prototype.removeKeys = function removeKeys(target: alt.Player): boolean {
    const v: alt.Vehicle = this as alt.Vehicle;
    const index = v.keys.findIndex((x) => x === target.data._id.toString());
    if (index <= -1) {
        return true;
    }

    v.setStreamSyncedMeta(Vehicle_State.KEYS, v.keys);
    v.keys.splice(index, 1);
    return true;
};

alt.Vehicle.prototype.setDoorOpen = function setDoorOpen(
    player: alt.Player,
    index: Vehicle_Door_List,
    state: boolean
): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!v.isOwner(player) && !v.hasKeys(player) && v.getLockState() !== Vehicle_Lock_State.UNLOCKED) {
        return;
    }

    // alt.log(`${doorName}: ${oppositeValue}`);
    const doorName = `DOOR_${Vehicle_Door_List[index]}`;
    if (!doorName) {
        return;
    }

    const stateName = Vehicle_State[`${doorName}`];
    v.setStreamSyncedMeta(stateName, state);
};

alt.Vehicle.prototype.setIntoVehicle = function setIntoVehicle(player: alt.Player, seat: Vehicle_Seat_List): void {
    const v: alt.Vehicle = this as alt.Vehicle;

    if (v.driver) {
        return;
    }

    if (v.driver === player) {
        return;
    }

    alt.nextTick(() => {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Vehicle_Events.SET_INTO, v, seat);
    });
};

alt.Vehicle.prototype.cycleLock = function cycleLock(player: alt.Player): Vehicle_Lock_State {
    const v: alt.Vehicle = this as alt.Vehicle;

    if (!v.isOwner(player) && !v.hasKeys(player)) {
        return v.athenaLockState;
    }

    if (!v.athenaLockState) {
        v.athenaLockState = Vehicle_Lock_State.LOCKED;
        v.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, v.athenaLockState);
    } else if (v.athenaLockState + 1 >= Vehicle_Lock_States.length) {
        v.athenaLockState = Vehicle_Lock_State.UNLOCKED;
        v.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, v.athenaLockState);
    } else {
        v.athenaLockState += 1;
        v.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, v.athenaLockState);
    }

    // Automatically Close All Doors in Locked State
    if (v.athenaLockState === Vehicle_Lock_State.LOCKED) {
        for (let i = 0; i < 6; i++) {
            v.setDoorOpen(player, i, false);
        }
    }

    return v.athenaLockState;
};

alt.Vehicle.prototype.setOwner = function setOwner(player: alt.Player): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    v.owner = player.id;
    v.setStreamSyncedMeta(Vehicle_State.OWNER, v.owner);
    v.cycleLock(player);
};

alt.Vehicle.prototype.setEngine = function setEngine(player: alt.Player): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!v.isOwner(player) && !v.hasKeys(player)) {
        return;
    }

    v.engineStatus = !v.engineStatus ? true : false;
    v.setStreamSyncedMeta(Vehicle_State.ENGINE, v.engineStatus);
    player.showNotification(`Engine ~y~${v.engineStatus ? 'On' : 'Off'}`);
};
