import * as alt from 'alt-server';

import { PluginSystem } from '../plugins';
import { Athena } from '@AthenaServer/api/athena';
import { getWeaponMap } from '@AthenaShared/information/weaponList';
import { StoredItem } from '@AthenaShared/interfaces/item';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

type AmmoOrWeapon = { ammo: number; hash?: number };

const SYSTEM_NAME = 'Ammunition Items';

let enabled = true;

const Internal = {
    combineData(item1: StoredItem<AmmoOrWeapon>, item2: StoredItem<AmmoOrWeapon>): Required<AmmoOrWeapon> {
        let data: { hash?: number; ammo: number } = { ammo: 0 };

        if (typeof item1.data.hash !== 'undefined') {
            data.hash = item1.data.hash;
        }

        if (typeof item2.data.hash !== 'undefined') {
            data.hash = item2.data.hash;
        }

        data.ammo = item1.data.ammo + item2.data.ammo;
        return data as Required<AmmoOrWeapon>;
    },
    async init() {
        if (!enabled) {
            return;
        }

        Athena.systems.itemFactory.async.upsert({
            dbName: 'ammo-box',
            data: {
                ammo: 32,
            },
            icon: 'ammo',
            name: 'Ammo Box',
            maxStack: 24,
            weight: 2,
            behavior: { canDrop: true, canStack: true, canTrade: true, destroyOnDrop: false, isToolbar: false },
        });

        const weaponList = getWeaponMap();
        Object.keys(weaponList).forEach((key) => {
            Athena.systems.itemCrafting.recipe.add({
                uid: `${key}-ammo-box`,
                combo: [key, 'ammo-box'],
                quantities: [1, 1],
                result: {
                    dbName: key,
                    quantity: 1,
                    data: Internal.combineData,
                },
            });
        });

        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
};

export const DefaultAmmoItemsSystem = {
    disable: () => {
        enabled = false;
        alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
    },
};

PluginSystem.callback.add(Internal.init);
