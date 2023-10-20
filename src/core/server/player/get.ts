import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { StoredItem, StoredItemEx, WeaponInfo } from '@AthenaShared/interfaces/item.js';

/**
 * Get a characters full character name.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function name(player: alt.Player) {
    const name = Athena.document.character.getField(player, 'name');
    return name ? name : 'No Character Specified';
}

/**
 * Get a characters current cash balance.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function cash(player: alt.Player) {
    const cash = Athena.document.character.getField(player, 'cash');
    return cash ? cash : 0;
}

/**
 * Get a characters current bank balance.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function bank(player: alt.Player) {
    const bank = Athena.document.character.getField(player, 'bank');
    return bank ? bank : 0;
}

/**
 * Check if a character is dead.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function isDead(player: alt.Player) {
    const isDead = Athena.document.character.getField(player, 'isDead');
    return isDead ? true : false;
}

/**
 * Get the characters inventory.
 *
 * Returns a readable array, but cannot be modified.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function inventory(player: alt.Player): Readonly<StoredItem[]> {
    const inventory = Athena.document.character.getField(player, 'inventory');
    return inventory ? inventory : [];
}

/**
 * Get the characters toolbar.
 *
 * Returns a readable array, but cannot be modified.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function toolbar(player: alt.Player): Readonly<StoredItem[]> {
    const toolbar = Athena.document.character.getField(player, 'toolbar');
    return toolbar ? toolbar : [];
}

/**
 * Get the characters food value.
 *
 * By default there is no food system in Athena, these values are placeholders.
 *
 * Returns a readable array, but cannot be modified.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function food(player: alt.Player): number {
    const value = Athena.document.character.getField(player, 'food');
    return typeof value === 'number' ? value : 100;
}

/**
 * Get the characters water value.
 *
 * By default there is no water system in Athena, these values are placeholders.
 *
 * Returns a readable array, but cannot be modified.
 *
 * @export
 * @param {alt.Player} player
 * @return {*}
 */
export function water(player: alt.Player): number {
    const value = Athena.document.character.getField(player, 'water');
    return typeof value === 'number' ? value : 100;
}

/**
 * Return a list of groups, with their dedicated group permissions for this character.
 *
 * @export
 * @param {alt.Player} player
 * @return {{ [key: string]: Array<string> }}
 */
export function groups(player: alt.Player): { [key: string]: Array<string> } {
    const groups = Athena.document.character.getField(player, 'groups');
    return typeof groups === 'object' ? groups : {};
}

/**
 * Return a list of character permissions.
 *
 * @export
 * @param {alt.Player} player
 * @return {Array<string>}
 */
export function permissions(player: alt.Player): Array<string> {
    const permissions = Athena.document.character.getField(player, 'permissions');
    return Array.isArray(permissions) ? permissions : [];
}

/**
 * Return a list of account permissions.
 *
 * @export
 * @param {alt.Player} player
 * @return {Array<string>}
 */
export function accountPermissions(player: alt.Player): Array<string> {
    const permissions = Athena.document.account.getField(player, 'permissions');
    return Array.isArray(permissions) ? permissions : [];
}

/**
 * Return the current job instance.
 *
 * Returns `undefined` if not on a job.
 *
 * @export
 * @param {alt.Player} player
 * @return {Athena.systems.job.builder}
 */
export function job(player: alt.Player): Athena.systems.job.builder {
    return Athena.systems.job.instance.get(player);
}

/**
 * Get the currently equipped toolbar weapon slot
 *
 * @export
 * @param {alt.Player} player
 * @return {StoredItemEx<WeaponInfo> | undefined}
 */
export function getEquippedToolbarWeapon(player: alt.Player): StoredItemEx<WeaponInfo> | undefined {
    const items = Athena.document.character.getField<{}, StoredItemEx<WeaponInfo>[]>(player, 'toolbar');
    for (let item of items) {
        if (!item.isEquipped) {
            continue;
        }

        const baseItem = Athena.systems.inventory.convert.toBaseItem(item);
        if (!baseItem.behavior || !baseItem.behavior.isWeapon) {
            continue;
        }

        return item;
    }

    return undefined;
}
