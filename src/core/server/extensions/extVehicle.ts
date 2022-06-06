import * as alt from 'alt-server';

import { Vehicle_Behavior } from '../../shared/enums/vehicle';
import { IVehicle } from '../../shared/interfaces/iVehicle';
import { Vector3 } from '../../shared/interfaces/vector';

declare module 'alt-server' {
    export interface Vehicle {
        /**
         * The alt:V player id who owns this vehicle.
         * @type {number}
         * @memberof Vehicle
         */
        player_id?: number;

        /**
         * What happens when a player interacts with this vehicle.
         * @type {Vehicle_Behavior}
         * @memberof Vehicle
         */
        behavior?: Vehicle_Behavior;

        /**
         * Vehicle Information from Database Storage
         * @type {IVehicle}
         * @memberof Vehicle
         */
        data?: IVehicle;

        /**
         * The next time this vehicle will be saved in the database.
         * @type {number}
         * @memberof Vehicle
         */
        nextSave?: number;

        /**
         * The next time this vehicle data will be updated.
         * Mostly used for fuel.
         * @type {number}
         * @memberof Vehicle
         */
        nextUpdate?: number;

        /**
         * Is the vehicle a temporary vehicle?
         * Meaning will this vehicle be deleted after exiting?
         * @type {boolean}
         * @memberof Vehicle
         */
        isTemporary?: boolean;

        /**
         * Flag to determine if the vehicle is currently being pushed.
         * If the vehicle is being pushed prevent other functionality.
         * @type {boolean}
         * @memberof Vehicle
         */
        isBeingPushed?: boolean;

        /**
         * Get or set the vehicle pusher.
         * @type {number}
         * @memberof Vehicle
         */
        vehiclePusherID?: number;

        /**
         * Override the isTemporary flag from.
         * Will not delete the vehicle if this is enabled.
         * @type {boolean}
         * @memberof Vehicle
         */
        overrideTemporaryDeletion?: boolean;

        /**
         * The last position of the vehicle.
         * This is only defined for vehicles that use fuel.
         * As well as vehicles that can be saved.
         * @type {Vector3}
         * @memberof Vehicle
         */
        lastPosition?: Vector3;

        /**
         * The model name of the vehicle.
         * Only available if the vehicle was spawned through Athena functions.
         * Meaning you did not use new alt.Vehicle
         * @type {string}
         * @memberof Vehicle
         */
        modelName?: string;

        /**
         * A simple unique identifier to add to a vehicle.
         * @type {string}
         * @memberof Vehicle
         */
        uid?: string;
    }
}
