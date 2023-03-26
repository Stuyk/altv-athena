import * as alt from 'alt-server';

import * as Athena from '@AthenaServer/api';
import { StoredItem, WeaponInfo } from '@AthenaShared/interfaces/item';
import { deepCloneArray } from '@AthenaShared/utility/deepCopy';

/**
 * Return all weapons from a given data set.
 *
 * @export
 * @param {Array<StoredItem>} dataSet
 */
export function get(dataSet: Array<StoredItem>): Array<StoredItem> {
    const list = [];

    for (let item of dataSet) {
        const baseItem = Athena.systems.inventory.factory.getBaseItem(item.dbName, item.version);

        if (!baseItem.behavior) {
            continue;
        }

        if (!baseItem.behavior.isWeapon) {
            continue;
        }

        list.push(item);
    }

    return list;
}

/**
 * Remove all weapons from a given data set.
 *
 * @export
 * @param {Array<StoredItem>} dataSet
 * @return {Array<StoredItem>}
 */
export function removeAll(dataSet: Array<StoredItem>): Array<StoredItem> {
    const clonedSet = deepCloneArray<StoredItem>(dataSet);
    const slots = get(clonedSet).map((x) => {
        return x.slot;
    });

    for (let i = clonedSet.length - 1; i >= 0; i--) {
        if (slots.findIndex((x) => x === clonedSet[i].slot) <= -1) {
            continue;
        }

        clonedSet.splice(i, 1);
    }

    return clonedSet;
}

/**
 * Looks into the item toolbar and determines what weapons to equip / unequip.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {void}
 */
export function update(player: alt.Player) {
    if (Overrides.update) {
        return Overrides.update(player);
    }

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
}

interface WeaponFuncs {
    update: typeof update;
}

const Overrides: Partial<WeaponFuncs> = {};

export function override(functionName: 'update', callback: typeof update);
/**
 * Used to override inventory item weapon functionality
 *
 * @export
 * @param {keyof WeaponFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof WeaponFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
