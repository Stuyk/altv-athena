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

const SYSTEM_NAME = 'Spawn Vehicles on Join';

let enabled = true;

const Internal = {
    init() {
        if (!enabled) {
            return;
        }

        Athena.player.events.on('selected-character', Internal.processPlayer);
        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
    async processPlayer(player: alt.Player) {
        const playerName = Athena.document.character.getField(player, 'name');
        if (!playerName) {
            return;
        }

        const vehicles = await Athena.getters.player.ownedVehicleDocuments(player);
        let count = 0;

        for (let vehicle of vehicles) {
            if (vehicle.garageInfo) {
                continue;
            }

            const veh = Athena.vehicle.spawn.persistent(vehicle);
            if (typeof veh === 'undefined') {
                continue;
            }

            count += 1;
        }

        alt.log(`~y~${count} vehicles owned by ${playerName} spawned.`);
    },
};

/**
 * Disable vehicles spawning when a player joins.
 *
 *
 * #### Example
 * ```ts
 * Athena.systems.default.vehiclesSpawnOnJoin.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
