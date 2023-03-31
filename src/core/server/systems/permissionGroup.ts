export interface PermissionGroup {
    groups?: { [key: string]: Array<string> };
}

/**
 * Add a group key to a document, and return the document.
 *
 * Document can be anything.
 *
 * #### Example
 * ```ts
 * const data = Athena.document.character.get(somePlayer);
 * if (!data) {
 *     return;
 * }
 *
 * const modifiedDocument = Athena.systems.permissionGroup.addGroupKey<typeof data>(data, 'police', 'police-chief');
 * await Athena.document.character.set(somePlayer, 'groups', modifiedDocument.groups);
 * ```
 *
 * @export
 * @template T
 * @param {(T)} document
 * @param {string} groupName
 * @param {(Array<string> | string)} value
 * @return {(T & PermissionGroup)}
 */
export function addGroupPerm<T>(
    document: T & PermissionGroup,
    groupName: string,
    value: Array<string> | string,
): T & PermissionGroup {
    if (!document.groups) {
        document.groups = {};
    }

    if (!document.groups[groupName]) {
        document.groups[groupName] = [];
    }

    if (typeof value === 'string') {
        value = [value];
    }

    for (let permission of value) {
        const index = document.groups[groupName].findIndex((x) => x === permission);
        if (index >= 0) {
            continue;
        }

        document.groups[groupName].push(permission);
    }

    return document;
}

/**
 * Remove a permission from a group key.
 *
 * @export
 * @template T
 * @param {(T & PermissionGroup)} document
 * @param {string} groupName
 * @param {string} value
 * @return {(T & PermissionGroup)}
 */
export function removeGroupPerm<T>(
    document: T & PermissionGroup,
    groupName: string,
    value: Array<string> | string,
): T & PermissionGroup {
    if (!document.groups) {
        return document;
    }

    if (!document.groups[groupName]) {
        return document;
    }

    if (typeof value === 'string') {
        value = [value];
    }

    for (let i = value.length - 1; i >= 0; i--) {
        const permission = value[i];
        const index = document.groups[groupName].findIndex((x) => x === permission);
        if (index <= -1) {
            continue;
        }

        document.groups[groupName].splice(i, 1);
    }

    if (document.groups[groupName].length <= 0) {
        delete document.groups[groupName];
    }

    return document;
}

/**
 * Removes a group entirely from a document.
 *
 * @export
 * @template T
 * @param {(T & PermissionGroup)} document
 * @param {string} groupName
 * @return {*}
 */
export function removeGroup<T>(document: T & PermissionGroup, groupName: string) {
    if (!document.groups) {
        return document;
    }

    delete document.groups[groupName];
    return document;
}

/**
 * Checks if the documet is part of a group.
 *
 * @export
 * @param {PermissionGroup} document
 * @param {string} groupName
 * @return {boolean}
 */
export function hasGroup(document: PermissionGroup, groupName: string): boolean {
    if (!document.groups) {
        return false;
    }

    if (!document.groups[groupName]) {
        return false;
    }

    return true;
}

/**
 * Check if a document has a specific group permission.
 *
 * @export
 * @param {PermissionGroup} document
 * @param {string} groupName
 * @param {string} permission
 * @returns {boolean}
 */
export function hasGroupPerm(document: PermissionGroup, groupName: string, permission: string): boolean {
    if (!document.groups) {
        return false;
    }

    if (!document.groups[groupName]) {
        return false;
    }

    return document.groups[groupName].findIndex((x) => x === permission) >= 0;
}

/**
 * Check if a specific document has any of the listed permissions.
 *
 * @export
 * @param {PermissionGroup} document
 * @param {string} groupName
 * @param {Array<string>} permissions
 */
export function hasAtLeastOneGroupPerm(
    document: PermissionGroup,
    groupName: string,
    permissions: Array<string>,
): boolean {
    if (!document.groups) {
        return false;
    }

    if (!document.groups[groupName]) {
        return false;
    }

    for (let perm of permissions) {
        const result = hasGroupPerm(document, groupName, perm);
        if (!result) {
            continue;
        }

        return true;
    }

    return false;
}

/**
 * Checks if the given documents have a common permission.
 *
 * @name hasCommonPermission
 * @param {Array<PermissionGroup>} documents
 * @param {string} groupName
 * @param {string} permission
 * @returns {boolean}
 * @exports
 */
export function hasCommonPermission(documents: Array<PermissionGroup>, groupName: string, permission: string) {
    for (let document of documents) {
        if (!document.groups) {
            return false;
        }

        if (!document.groups[groupName]) {
            return false;
        }

        const index = document.groups[groupName].findIndex((x) => x === permission);
        if (index <= -1) {
            return false;
        }
    }

    return true;
}
