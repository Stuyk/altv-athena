import * as alt from 'alt-server';

import { getWeaponMap } from '@AthenaShared/information/weaponList';
import { PluginSystem } from '../plugins';
import { ItemFactory } from '../itemFactory';

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
                    behavior: { canStack: false, isToolbar: true, isWeapon: true },
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
