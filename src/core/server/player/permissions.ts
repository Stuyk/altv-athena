import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { PermissionGroup } from '@AthenaServer/systems/permissionGroup.js';

/**
 * Adds a permission to the given player character.
 *
 * @async
 * @name addPermission
 * @param {alt.Player} player
 * @param {string} permission
 * @returns {Promise<boolean>}
 * @exports
 */
export async function addPermission(player: alt.Player, permission: string) {
    return await Athena.systems.permission.add('character', player, permission);
}

/**
 * Add a permission to the given player's account.
 *
 * @export
 * @param {alt.Player} player
 * @param {string} permission
 * @return {*}
 */
export async function addAcountPermissions(player: alt.Player, permission: string) {
    return await Athena.systems.permission.add('account', player, permission);
}

/**
 * Removes a permission from the given player character.
 *
 * @async
 * @name removePermission
 * @param {alt.Player} player
 * @param {string} permission
 * @returns {Promise<boolean>}
 * @exports
 */
export async function removePermission(player: alt.Player, permission: string) {
    return await Athena.systems.permission.remove('character', player, permission);
}

/**
 * Remove a permission to the given player's account.
 *
 * @export
 * @param {alt.Player} player
 * @param {string} permission
 * @return {*}
 */
export async function removeAccountPermission(player: alt.Player, permission: string) {
    return await Athena.systems.permission.remove('account', player, permission);
}

/**
 * Check if the current player character has a permission.
 *
 * @export
 * @param {alt.Player} player
 * @param {string} permission
 * @return {boolean}
 */
export function hasPermission(player: alt.Player, permission: string) {
    return Athena.systems.permission.has('character', player, permission);
}

/**
 * Check if the player has an account permission.
 *
 * @export
 * @param {alt.Player} player
 * @param {string} permission
 * @return {boolean}
 */
export function hasAccountPermission(player: alt.Player, permission: string) {
    return Athena.systems.permission.has('account', player, permission);
}

/**
 * Check if a player character has a group permission.
 *
 * @export
 * @param {alt.Player} player
 * @param {string} groupName
 * @param {string} permission
 * @returns {boolean}
 */
export function hasGroupPermission(player: alt.Player, groupName: string, permission: string) {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    return Athena.systems.permissionGroup.hasGroupPerm(data, groupName, permission);
}

/**
 * Check if a player has any matching permissions against another document.
 *
 * @export
 * @param {alt.Player} player
 * @param {PermissionGroup} document
 * @param {string} groupName
 * @param {string} permission
 */
export function hasCommonGroupPermission(
    player: alt.Player,
    document: PermissionGroup,
    groupName: string,
    permission: string,
) {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    return Athena.systems.permissionGroup.hasCommonPermission([data, document], groupName, permission);
}

/**
 * Add a group permission to a character.
 *
 * If a player group permission, and a vehicle group permission intercept, then vehicle control is granted.
 *
 * @export
 * @param {alt.Player} player
 * @param {string} groupName
 * @param {string} permission
 * @return {Promise<boolean>}
 */
export async function addGroupPerm(player: alt.Player, groupName: string, permission: string): Promise<boolean> {
    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    const newDocument = Athena.systems.permissionGroup.addGroupPerm(data, groupName, permission);
    await Athena.document.character.set(player, 'groups', newDocument.groups);
    return true;
}
