import * as alt from 'alt-server';

import { Vehicle_Behavior } from '../../shared/enums/vehicle';
import { IVehicle } from '../../shared/interfaces/IVehicle';

declare module 'alt-server' {
    export interface Vehicle {
        /**
         * List of player ids who currently have a key.
         * @type {Array<string>}
         * @memberof Vehicle
         */
        keys?: Array<string>;

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
         * Passengers that are currently in this vehicle.
         * @type {Array<{ player: alt.Player; seat: number }>}
         * @memberof Vehicle
         */
        passengers?: Array<{ player: alt.Player; seat: number }>;

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
         * Override the isTemporary flag from.
         * Will not delete the vehicle if this is enabled.
         * @type {boolean}
         * @memberof Vehicle
         */
        overrideTemporaryDeletion?: boolean;

        /**
         * Is this vehicle currently being refueled.
         * @type {boolean}
         * @memberof Vehicle
         */
        isRefueling?: boolean;
    }
}
