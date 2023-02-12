import * as alt from 'alt-server';

import { getWeaponMap } from '@AthenaShared/information/weaponList';
import { PluginSystem } from '../plugins';
import { ItemFactory } from '../inventory/factory';

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
                ItemFactory.async.upsert({
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

export const DefaultWeaponItemsSystem = {
    disable: () => {
        enabled = false;
        alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
    },
};

PluginSystem.callback.add(Internal.init);