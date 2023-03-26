import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Vehicles Despawn on Destroy';

let msBeforeRemoval = 60000;
let enabled = true;

const Internal = {
    init() {
        if (!enabled) {
            return;
        }

        alt.on('vehicleDestroy', Internal.handleDestroy);
        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
    async handleDestroy(vehicle: alt.Vehicle) {
        const data = Athena.document.vehicle.get(vehicle);
        Athena.vehicle.events.trigger('vehicle-destroyed', vehicle, data ? data : undefined);

        alt.setTimeout(() => {
            if (!vehicle || !vehicle.valid) {
                return;
            }

            try {
                alt.log(`Removed 1 Destroyed Vehicle that was spawned.`);
                vehicle.destroy();
            } catch (err) {}
        }, msBeforeRemoval);
    },
};

/**
 * Disable vehicles despawning when a player leaves.
 *
 *
 * #### Example
 * ```ts
 * Athena.systems.default.vehiclesDespawnOnDestroy.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

/**
 * Set the time before a vehicle is removed after it is destroyed.
 *
 *
 * @param {number} milliseconds
 */
export function setTimeBeforeRemove(milliseconds: number) {
    msBeforeRemoval = milliseconds;
}

Athena.systems.plugins.addCallback(Internal.init);
