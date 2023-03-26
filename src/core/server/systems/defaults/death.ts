import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

const HOSPITALS = [
    { x: -248.01309204101562, y: 6332.01513671875, z: 33.0750732421875 },
    { x: 1839.15771484375, y: 3672.702392578125, z: 34.51904296875 },
    { x: 297.4647521972656, y: -584.7089233398438, z: 44.292724609375 },
    { x: -677.0172119140625, y: 311.7821350097656, z: 83.601806640625 },
    { x: 1151.2904052734375, y: -1529.903564453125, z: 36.3017578125 },
];

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

let enabled = true;

const Internal = {
    /**
     * Returns the closest hospital position.
     *
     * @param {alt.IVector3} pos A position in the world.
     * @return {alt.IVector3}
     */
    getClosestHospital(pos: alt.IVector3): alt.IVector3 {
        const sortedByDistance = HOSPITALS.sort((a, b) => {
            const distA = Athena.utility.vector.distance2d(pos, a);
            const distB = Athena.utility.vector.distance2d(pos, b);
            return distA - distB;
        });

        return sortedByDistance[0];
    },
    /**
     * Respawns the player, and resets their death data.
     *
     * @param {alt.Player} victim
     * @return {void}
     */
    respawn(victim: alt.Player) {
        if (!enabled) {
            return;
        }

        if (!victim || !victim.valid) {
            return;
        }

        const victimData = Athena.document.character.get(victim);
        if (typeof victimData === 'undefined') {
            return;
        }

        if (!victimData.isDead) {
            return;
        }

        const newPosition = Internal.getClosestHospital(victim.pos);
        Athena.document.character.set(victim, 'isDead', false);
        victim.spawn(newPosition.x, newPosition.y, newPosition.z, 0);
        Athena.player.events.trigger('respawned', victim);
    },

    /**
     * Respawns the player after 5 seconds in their same position.
     *
     * @param {alt.Player} victim
     * @return {void}
     */
    handleDefaultDeath(victim: alt.Player) {
        if (!enabled) {
            return;
        }

        if (!victim || !victim.valid) {
            return;
        }

        const victimData = Athena.document.character.get(victim);
        if (!victimData) {
            return;
        }

        Athena.document.character.set(victim, 'isDead', true);
        Athena.player.events.trigger('player-died', victim);

        alt.setTimeout(() => {
            if (!victim || !victim.valid) {
                return;
            }

            Internal.respawn(victim);
        }, 5000);
    },
    init() {
        if (!enabled) {
            return;
        }

        Athena.player.events.on('selected-character', Internal.respawn);
        alt.on('playerDeath', Internal.handleDefaultDeath);
        alt.log(`~lc~Default System: ~g~Death`);
    },
};

/**
 * Disable default death system from working.
 *
 *
 * #### Example
 * ```ts
 * Athena.systems.default.death.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.off('playerDeath', Internal.handleDefaultDeath);
    alt.log(`~y~Default Death System Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
