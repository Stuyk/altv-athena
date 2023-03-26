import * as Athena from '@AthenaServer/api';
import * as alt from 'alt-server';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Hospital Blips';
const HOSPITALS = [
    { x: -248.01309204101562, y: 6332.01513671875, z: 33.0750732421875 },
    { x: 1839.15771484375, y: 3672.702392578125, z: 34.51904296875 },
    { x: 297.4647521972656, y: -584.7089233398438, z: 44.292724609375 },
    { x: -677.0172119140625, y: 311.7821350097656, z: 83.601806640625 },
    { x: 1151.2904052734375, y: -1529.903564453125, z: 36.3017578125 },
];

let enabled = true;

const Internal = {
    async init() {
        if (!enabled) {
            return;
        }

        for (let i = 0; i < HOSPITALS.length; i++) {
            Athena.controllers.blip.append({
                text: 'Hospital',
                color: 6,
                sprite: 153,
                scale: 1,
                shortRange: true,
                pos: HOSPITALS[i],
                uid: `hospital-${i}`,
            });
        }

        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
};

/**
 * Disable default hospital blips from being created
 *
 * #### Example
 * ```ts
 * Athena.systems.default.hospitalBlips.disable();
 * ```
 *
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
