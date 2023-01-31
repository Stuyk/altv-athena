import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { StoredItem, WeaponInfo } from '@AthenaShared/interfaces/item';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';

export const ItemWeapon = {
    /**
     * Looks into the item toolbar and determines what weapons to equip / unequip.
     *
     * @param {alt.Player} player
     * @return {*}
     */
    update(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined' || typeof data.toolbar === 'undefined') {
            return;
        }

        const index = data.toolbar.findIndex((x) => {
            if (!x.isEquipped) {
                return false;
            }

            if (typeof x.data === 'undefined') {
                return false;
            }

            if (!Object.hasOwn(x.data, 'ammo') && !Object.hasOwn(x.data, 'hash')) {
                return false;
            }

            return true;
        });

        player.removeAllWeapons();
        if (index <= -1) {
            return;
        }

        const item = data.toolbar[index] as StoredItem<WeaponInfo>;
        player.giveWeapon(item.data.hash, item.data.ammo, true);

        if (typeof item.data.components === 'undefined') {
            return;
        }

        for (let component of item.data.components) {
            const hash = typeof component === 'string' ? alt.hash(component) : component;
            player.addWeaponComponent(item.data.hash, hash);
        }
    },
};
