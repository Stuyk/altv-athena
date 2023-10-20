import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { PermissionGroup } from '@AthenaServer/systems/permissionGroup.js';

/**
 * Check if a vehicle has a group permission.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {string} groupName
 * @param {string} permission
 * @returns {boolean}
 */
export function hasGroupPermission(vehicle: alt.Vehicle, groupName: string, permission: string) {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    return Athena.systems.permissionGroup.hasGroupPerm(data, groupName, permission);
}

/**
 * Check if a vehicle has any matching permissions against another document.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {PermissionGroup} document
 * @param {string} groupName
 * @param {string} permission
 */
export function hasCommonGroupPermission(
    vehicle: alt.Vehicle,
    document: PermissionGroup,
    groupName: string,
    permission: string,
) {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    return Athena.systems.permissionGroup.hasCommonPermission([data, document], groupName, permission);
}

/**
 * Add a group permission to an owned vehicle.
 *
 * If a player group permission, and a vehicle group permission intercept, then vehicle control is granted.
 *
 * If a vehicle has any group permissions, all access is denied to non-matching group perms.
 *
 * @export
 * @param {alt.Vehicle} vehicle
 * @param {string} groupName
 * @param {string} permission
 * @return {Promise<boolean>}
 */
export async function addGroupPerm(vehicle: alt.Vehicle, groupName: string, permission: string): Promise<boolean> {
    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        return false;
    }

    const newDocument = Athena.systems.permissionGroup.addGroupPerm(data, groupName, permission);
    await Athena.document.vehicle.set(vehicle, 'groups', newDocument.groups);
    return true;
}
