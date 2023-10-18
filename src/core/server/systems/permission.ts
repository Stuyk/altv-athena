import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { Account } from '@AthenaShared/interfaces/iAccount.js';
import { Character } from '@AthenaShared/interfaces/character.js';
import Database from '@stuyk/ezmongodb';

export type DefaultPerms = 'admin' | 'moderator';
export type SupportedDocuments = 'account' | 'character';

const InternalFunctions = {
    /**
     * Add a permission to a player based on default permissions, or a custom permission.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     */
    async add<CustomPerms = ''>(
        player: alt.Player,
        perm: DefaultPerms | CustomPerms,
        dataName: SupportedDocuments,
    ): Promise<boolean> {
        if (typeof Athena.document[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const data = Athena.document[dataName].get(player);
        if (typeof data === 'undefined') {
            return false;
        }

        if (!data.permissions) {
            data.permissions = [];
        }

        const formattedPerm = String(perm).toLowerCase();
        const index = data.permissions.findIndex((x) => x === formattedPerm);
        if (index >= 0) {
            return false;
        }

        data.permissions.push(formattedPerm);
        await Athena.document[dataName].set(player, 'permissions', data.permissions);
        return true;
    },
    /**
     * Remove a permission from a player based on default permissions, or a custom permission.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     */
    async remove<CustomPerms = ''>(
        player: alt.Player,
        perm: DefaultPerms | CustomPerms,
        dataName: SupportedDocuments,
    ): Promise<boolean> {
        if (typeof Athena.document[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const data = Athena.document[dataName].get(player);
        if (typeof data === 'undefined') {
            return false;
        }

        if (!data.permissions) {
            data.permissions = [];
        }

        const formattedPerm = String(perm).toLowerCase();
        const index = data.permissions.findIndex((x) => x === formattedPerm);
        if (index <= -1) {
            return false;
        }

        data.permissions.splice(index, 1);
        await Athena.document[dataName].set(player, 'permissions', data.permissions);
        return true;
    },
    /**
     * Clear all permissions from a player's account.
     *
     * @param {alt.Player} player An alt:V Player Entity
     * @return {void}
     */
    async clear(player: alt.Player, dataName: SupportedDocuments) {
        if (typeof Athena.document[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return;
        }

        const data = Athena.document[dataName].get(player);
        if (typeof data === 'undefined') {
            return;
        }

        data.permissions = [];
        await Athena.document[dataName].set(player, 'permissions', data.permissions);
    },
    /**
     * Check if a player has a permission.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(DefaultPerms | CustomPerms)} perm
     * @return {boolean}
     */
    has<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms, dataName: SupportedDocuments): boolean {
        if (typeof Athena.document[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const data = Athena.document[dataName].get(player);
        if (typeof data === 'undefined' || typeof data.permissions === 'undefined') {
            return false;
        }

        if (data.permissions.length <= 0) {
            return false;
        }

        const formattedPerm = String(perm).toLowerCase();
        return data.permissions.findIndex((x) => x === formattedPerm) !== -1;
    },
    /**
     * Check if a player has at least one permission given an Array of permissions.
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(Array<DefaultPerms | CustomPerms>)} perm
     * @return {boolean}
     */
    hasOne<CustomPerms = ''>(
        player: alt.Player,
        perms: Array<DefaultPerms | CustomPerms>,
        dataName: SupportedDocuments,
    ): boolean {
        if (typeof Athena.document[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const data = Athena.document[dataName].get(player);
        if (typeof data === 'undefined' || typeof data.permissions === 'undefined') {
            return false;
        }

        // Should return true if a permission is just an empty array.
        // Should also check this before checking player perms if they haven't had any perms added yet.
        if (perms.length <= 0) {
            return true;
        }

        if (data.permissions.length <= 0) {
            return false;
        }

        for (let perm of perms) {
            const index = data.permissions.findIndex((x) => x === perm);
            if (index <= -1) {
                continue;
            }

            return true;
        }

        return false;
    },
    /**
     * Check if a player has all permissions in an array..
     *
     * @template CustomPerms
     * @param {alt.Player} player An alt:V Player Entity
     * @param {(Array<DefaultPerms | CustomPerms>)} perms
     * @return {boolean}
     */
    hasAll<CustomPerms = ''>(
        player: alt.Player,
        perms: Array<DefaultPerms | CustomPerms>,
        dataName: SupportedDocuments,
    ): boolean {
        if (typeof Athena.document[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const data = Athena.document[dataName].get(player);
        if (typeof data === 'undefined' || typeof data.permissions === 'undefined') {
            return false;
        }

        // Should return true if a permission is just an empty array.
        // Should also check this before checking player perms if they haven't had any perms added yet.
        if (perms.length <= 0) {
            return true;
        }

        if (data.permissions.length <= 0) {
            return false;
        }

        for (let perm of perms) {
            const index = data.permissions.findIndex((x) => x === perm);
            if (index <= -1) {
                return false;
            }

            continue;
        }

        return true;
    },
};

/**
 * Add a permission to an account or character.
 *
 *
 * @template CustomPerms
 * @param {('character' | 'account')} type
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(DefaultPerms | CustomPerms)} perm
 * @return {Promise<boolean>}
 */
export async function add<CustomPerms = ''>(
    type: 'character' | 'account',
    player: alt.Player,
    perm: DefaultPerms | CustomPerms,
): Promise<boolean> {
    return await InternalFunctions.add(player, perm, type);
}

/**
 * Remove a permission from an account or character.
 *
 *
 * @template CustomPerms
 * @param {('character' | 'account')} type
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(DefaultPerms | CustomPerms)} perm
 * @return {Promise<boolean>}
 */
export async function remove<CustomPerms = ''>(
    type: 'character' | 'account',
    player: alt.Player,
    perm: DefaultPerms | CustomPerms,
): Promise<boolean> {
    return await InternalFunctions.remove(player, perm, type);
}

/**
 * Clear all permissions for an account or character.
 *
 *
 * @param {('character' | 'account')} type
 * @param {alt.Player} player An alt:V Player Entity
 * @return {Promise<void>}
 */
export async function clear(type: 'character' | 'account', player: alt.Player) {
    return await InternalFunctions.clear(player, type);
}

/**
 * Check if a character or account has a single permission.
 *
 *
 * @template CustomPerms
 * @param {('character' | 'account')} type
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(DefaultPerms | CustomPerms)} perm
 * @return {boolean}
 */
export function has<CustomPerms = ''>(
    type: 'character' | 'account',
    player: alt.Player,
    perm: DefaultPerms | CustomPerms,
): boolean {
    return InternalFunctions.has(player, perm, type);
}

/**
 * Check if a character or account has a atleast one permission.
 *
 *
 * @template CustomPerms
 * @param {('character' | 'account')} type
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(Array<DefaultPerms | CustomPerms>)} perms
 * @return {boolean}
 */
export function hasOne<CustomPerms = ''>(
    type: 'character' | 'account',
    player: alt.Player,
    perms: Array<DefaultPerms | CustomPerms>,
): boolean {
    return InternalFunctions.hasOne(player, perms, type);
}

/**
 * Check if a character or account has all the permissions.
 *
 *
 * @template CustomPerms
 * @param {('character' | 'account')} type
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(Array<DefaultPerms | CustomPerms>)} perms
 * @return {boolean}
 */
export function hasAll<CustomPerms = ''>(
    type: 'character' | 'account',
    player: alt.Player,
    perms: Array<DefaultPerms | CustomPerms>,
): boolean {
    return InternalFunctions.hasAll(player, perms, type);
}

/**
 * Get all documents that have a specified permission in their permissions array.
 * Will return an empty array if no permissions are found.
 *
 *
 * @template CustomPerms
 * @param {('character' | 'account')} type
 * @param {(Array<DefaultPerms | CustomPerms>)} perms
 */
export async function getAll<CustomPerms = ''>(
    type: 'character' | 'account',
    perm: DefaultPerms | CustomPerms,
): Promise<Array<Account> | Array<Character>> {
    const db = await Database.getDatabaseInstance();
    const collectionName =
        type === 'character' ? Athena.database.collections.Characters : Athena.database.collections.Accounts;
    const collection = db.collection(collectionName);
    const results = await collection.find({ permissions: perm }).toArray();
    const converted = results.map((x) => {
        return {
            ...x,
            _id: x._id.toString(),
        };
    });

    if (type === 'character') {
        return converted as Array<Character>;
    }

    return converted as Array<Account>;
}

/**
 * Remove specified permission from all instances of an account or character.
 * Automatically rebinds the document after updating.
 *
 *
 * @param {('character' | 'account')} type
 * @param {(DefaultPerms | CustomPerms)} perm
 * @param {Array<string>} ids
 */
export async function removeAll<CustomPerms = ''>(
    type: 'character' | 'account',
    perm: DefaultPerms | CustomPerms,
    ids: Array<string>,
): Promise<void> {
    const collectionName =
        type === 'character' ? Athena.database.collections.Characters : Athena.database.collections.Accounts;

    const promises = [];

    for (let _id of ids) {
        const document = await Database.fetchData<{ _id: unknown; permissions: Array<string> }>(
            '_id',
            _id,
            collectionName,
        );

        document._id = String(document._id);
        const index = document.permissions.findIndex((x) => x === String(perm));
        if (index <= -1) {
            continue;
        }

        promises.push(
            new Promise(async (resolve: Function) => {
                document.permissions.splice(index, 1);
                await Database.updatePartialData(_id, { permissions: document.permissions }, collectionName);

                let player: alt.Player;
                if (type === 'account') {
                    player = Athena.getters.player.byAccount(String(document._id));
                }

                if (type === 'character') {
                    player = Athena.getters.player.byDatabaseID(String(document._id));
                }

                if (!player) {
                    return resolve();
                }

                Athena.document[type].set(player, 'permissions', document.permissions);
                return resolve();
            }),
        );
    }

    await Promise.all(promises);
}

export function getPermissions(entity: alt.Player, type: 'character' | 'account');
export function getPermissions(entity: alt.Vehicle, type: 'vehicle');
/**
 * Get permissions for a given entity and type
 *
 *
 * @param {alt.Entity} entity
 * @param {('account' | 'character' | 'vehicle')} type
 * @return {Array<string>}
 */
export function getPermissions(entity: alt.Entity, type: 'account' | 'character' | 'vehicle'): Array<string> {
    let data;
    switch (type) {
        case 'account':
            data = Athena.document.account.get(entity as alt.Player);
            return data.permissions ? data.permissions : [];
        case 'character':
            data = Athena.document.account.get(entity as alt.Player);
            return data.permissions ? data.permissions : [];
        case 'vehicle':
            data = Athena.document.vehicle.get(entity as alt.Vehicle);
            return data.permissions ? data.permissions : [];
        default:
            return [];
    }
}

export default {
    add,
    remove,
    clear,
    has,
    hasOne,
    hasAll,
    getAll,
    removeAll,
};
