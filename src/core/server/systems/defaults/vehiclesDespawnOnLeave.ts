import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { Character } from '@AthenaShared/interfaces/character';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Vehicles Despawn on Leave';

let enabled = true;

const Internal = {
    init() {
        if (!enabled) {
            return;
        }

        Athena.player.events.on('player-disconnected', Internal.processPlayer);
        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
    async processPlayer(player: alt.Player, id: number, document: Character) {
        let removedVehicles = 0;

        const owner = document._id.toString();

        for (let vehicle of [...alt.Vehicle.all]) {
            const vehData = Athena.document.vehicle.get(vehicle);
            if (typeof vehData === 'undefined') {
                continue;
            }

            if (vehData.owner !== owner) {
                continue;
            }

            await Athena.vehicle.controls.update(vehicle);

            const vehicleId = vehicle.id;

            try {
                vehicle.destroy();
                removedVehicles += 1;
            } catch (err) {
                console.log(err);
            }

            Athena.document.vehicle.unbind(vehicleId);
        }

        alt.log(`~y~Removed ${removedVehicles} vehicles owned by ${document.name} on disconnect.`);
    },
};

/**
 * Disable vehicles despawning when a player leaves.
 *
 *
 * #### Example
 * ```ts
 * Athena.systems.default.vehiclesDespawnOnLeave.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
