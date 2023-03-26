import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { getWeaponMap } from '@AthenaShared/information/weaponList';
import { StoredItem, WeaponInfo } from '@AthenaShared/interfaces/item';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { deepCloneArray } from '@AthenaShared/utility/deepCopy';

/**
 * THIS IS A DEFAULT SYSTEM.
 * IF YOU WANT TO DISABLE IT, MAKE A PLUGIN AND DISABLE IT THROUGH:
 * `Athena.systems.default.x.disable()`
 *
 * DO NOT APPEND ANY ADDITIONAL DATA TO THIS SYSTEM.
 * COPY THE CODE AND REMAKE IT AS A PLUGIN IF YOU WANT TO MAKE CHANGES.
 */

const SYSTEM_NAME = 'Ammunition Items';
const hashes = {};

let enabled = true;

const Internal = {
    handleUpdate(player: alt.Player, uid: string, hash: number, ammo: number) {
        if (!hashes[player.id] || hashes[player.id] !== uid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return;
        }

        const toolbar = deepCloneArray<StoredItem<WeaponInfo>>(data.toolbar);
        const toolbarIndex = toolbar.findIndex((x) => x.isEquipped && x.data.hash && x.data.hash === hash);
        if (toolbarIndex <= -1) {
            return;
        }

        if (toolbar[toolbarIndex].data.ammo === ammo) {
            return;
        }

        toolbar[toolbarIndex].data.ammo = ammo;
        Athena.document.character.set(player, 'toolbar', toolbar, true);
    },
    weaponUpdateTick() {
        const players = Athena.getters.players.onlineWithWeapons();
        for (let armedPlayer of players) {
            if (!armedPlayer || !armedPlayer.valid) {
                continue;
            }

            const uid = Athena.utility.uid.generate();
            hashes[armedPlayer.id] = uid;
            armedPlayer.emit(SYSTEM_EVENTS.PLAYER_EMIT_AMMUNITION_UPDATE, uid, armedPlayer.currentWeapon);
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

        alt.setInterval(Internal.weaponUpdateTick, 500);
        alt.onClient(SYSTEM_EVENTS.PLAYER_EMIT_AMMUNITION_UPDATE, Internal.handleUpdate);
        alt.log(`~lc~Default System: ~g~${SYSTEM_NAME}`);
    },
};

/**
 * Used to disable the default ammo system that comes with Athena.
 *
 * #### Example
 * ```ts
 * Athena.systems.default.ammo.disable();
 * ```
 *
 *
 */
export function disable() {
    enabled = false;
    alt.log(`~y~Default ${SYSTEM_NAME} Turned Off`);
}

Athena.systems.plugins.addCallback(Internal.init);
