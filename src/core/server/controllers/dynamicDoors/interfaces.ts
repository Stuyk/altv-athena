import { Marker } from '@AthenaShared/interfaces/marker.js';
import * as alt from 'alt-server';

export interface DoorInfo {
    /**
     * Automatically subtracts 1 on creation.
     *
     * @type {alt.IVector3}
     * @memberof DoorInfo
     */
    pos: alt.IVector3;

    /**
     * Set this to true to allow vehicles to move through the door.
     *
     * @type {true}
     * @memberof DynamicDoor
     */
    allowVehicles?: true;

    /**
     * A label for the door, will create a text label if present.
     *
     * @type {string}
     * @memberof DoorInfo
     */
    text?: string;

    /**
     * If a dimension is specified, it will be used.
     *
     * Otherwise the door is available everywhere.
     *
     * The dimension to set when using this door.
     *
     * @type {number}
     * @memberof DoorInfo
     */
    dimension?: number;

    /**
     * A marker to generate for the door.
     *
     *
     * @type {Marker}
     * @memberof DoorInfo
     */
    marker?: Marker;

    /**
     * An IPL to load when the door is triggered
     *
     * @type {string}
     * @memberof DoorInfo
     */
    ipl?: string;

    /**
     * An IPL to unload when the door is triggered
     *
     * @type {string}
     * @memberof DoorInfo
     */
    iplUnload?: string;

    /**
     * A YTYP to load when the door is triggered.
     *
     * @type {string}
     * @memberof DoorInfo
     */
    ytyp?: string;

    /**
     * A YTYP to unload when the door is triggered.
     *
     * @type {string}
     * @memberof DoorInfo
     */
    ytypUnload?: string;

    /**
     * Trigger a callback before opening.
     *
     * Return true if permitted to enter the door.
     *
     * Otherwise, return false to prevent player from entering the door.
     *
     * @memberof DoorInfo
     */
    beforeEnter?: (player: alt.Player, doorInfo: DoorInfo) => boolean;

    /**
     * A callback to trigger when entering through the door.
     *
     * @memberof DoorInfo
     */
    afterEnter?: (player: alt.Player, doorInfo: DoorInfo) => void;
}

export interface DynamicDoor {
    /**
     * A unique identifier for a dynamic door
     *
     * @type {string}
     * @memberof DynamicDoor
     */
    uid: string;

    /**
     * Where the door entrance should be placed.
     *
     * @type {DoorInfo}
     * @memberof DynamicDoor
     */
    enter: DoorInfo;

    /**
     * Where the door exit should be placed.
     *
     * @type {DoorInfo}
     * @memberof DynamicDoor
     */
    leave: DoorInfo;
}

export type dDynamicDoor = DynamicDoor & { _id: unknown };
