import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import { getWeaponMap } from '@AthenaShared/information/weaponList';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Weapon Items List';

let enabled = true;

const Internal = {
    async init() {
        if (!enabled) {
            return;
        }

        const weapons = getWeaponMap();
        const promises = [];
        Object.keys(weapons).forEach((name) => {
            const weapon = weapons[name];
            promises.push(
                Athena.systems.inventory.factory.upsertAsync({
                    dbName: name,
                    icon: weapon.icon,
                    name: weapon.name,
                    data: { hash: weapon.hash, ammo: 0 },
                    behavior: { canStack: false, isToolbar: true, isWeapon: true, canDrop: true },
                    model: weapon.model,
                }),
            );
        });

        await Promise.all(promises);

        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
};

/**
 * Disable all weapon items from being created / used.
 * Does not remove them if they already exist in the database.
 *
 * #### Example
 * ```ts
 * Athena.systems.default.weaponItems.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
