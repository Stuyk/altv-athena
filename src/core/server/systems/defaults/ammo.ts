import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api/index.js';
import { getWeaponMap } from '@AthenaShared/information/weaponList.js';
import { StoredItem, StoredItemEx, WeaponInfo } from '@AthenaShared/interfaces/item.js';
import { InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces.js';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.defaults.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Ammunition Items';

let enabled = true;

const Internal = {
    update() {
        const armedPlayers = Athena.getters.players.onlineWithWeapons();
        for (let armedPlayer of armedPlayers) {
            const toolbarWeapon = Athena.player.get.getEquippedToolbarWeapon(armedPlayer);
            if (!toolbarWeapon) {
                continue;
            }

            try {
                const ammo = armedPlayer.getWeaponAmmo(armedPlayer.currentWeapon);
                Athena.player.toolbar.modifyItemData(armedPlayer, toolbarWeapon.slot, {
                    ...toolbarWeapon.data,
                    ammo: ammo >= 2 ? ammo : 0,
                });
            } catch (err) {}
        }
    },
    combineData(item1: StoredItem<WeaponInfo>, item2: StoredItem<WeaponInfo>): Required<WeaponInfo> {
        let data: WeaponInfo = {
            hash: undefined,
            ammo: 0,
        };

        if (typeof item1.data.hash !== 'undefined') {
            data.hash = item1.data.hash;
        }

        if (typeof item1.data.components !== 'undefined') {
            data.components = item1.data.components;
        }

        if (typeof item2.data.hash !== 'undefined') {
            data.hash = item2.data.hash;
        }

        if (typeof item2.data.components !== 'undefined') {
            data.components = item2.data.components;
        }

        data.ammo = item1.data.ammo + item2.data.ammo;
        return data as Required<WeaponInfo>;
    },
    async init() {
        if (!enabled) {
            return;
        }

        Athena.systems.inventory.factory.upsertAsync({
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
            Athena.systems.inventory.crafting.addRecipe({
                uid: `${key}-ammo-box`,
                combo: [key, 'ammo-box'],
                quantities: [1, 1],
                result: {
                    dbName: key,
                    quantity: 1,
                    data: Internal.combineData,
                },
                sound: 'weapon_load',
            });
        });

        Athena.player.events.on('item-equipped', (player: alt.Player, slot: number, type: InventoryType) => {
            const weaponItem = Athena.player[type].getAt(player, slot) as StoredItemEx<WeaponInfo>;
            if (!weaponItem) {
                return;
            }

            player.setWeaponAmmo(player.currentWeapon, weaponItem.data.ammo);
        });

        alt.setInterval(Internal.update, 1000);
        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
};

/**
 * Used to disable the default ammo system that comes with Athena.
 *
 * #### Example
 * ```ts
 * Athena.systems.defaults.ammo.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
