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
    },
    async processPlayer(player: alt.Player) {
        const vehicles = await Athena.getters.player.ownedVehicleDocuments(player);

        for (let vehicle of vehicles) {
            Athena.vehicle.spawn.persistent(vehicle);
        }
    },
};

/**
 * Disable vehicles spawning when a player joins.
 *
 * @export
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
