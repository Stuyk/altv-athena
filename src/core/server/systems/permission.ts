import { Athena } from '@AthenaServer/api/athena';
import * as alt from 'alt-server';

type DefaultPerms = 'admin' | 'moderator';
type SupportedDocuments = 'account' | 'character';

const InternalFunctions = {
    /**
     * Add a permission to a player based on default permissions, or a custom permission.
     *
     * @template CustomPerms
     * @param {alt.Player} player
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
     * @param {alt.Player} player
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
     * @param {alt.Player} player
     * @return {*}
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
     * @param {alt.Player} player
     * @param {(DefaultPerms | CustomPerms)} perm
     * @return {boolean}
     */
    has<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms, dataName: SupportedDocuments): boolean {
        if (typeof Athena.document[dataName] === 'undefined') {
            alt.logWarning(`Athena.document.${dataName} is not a supported document type.`);
            return false;
        }

        const data = Athena.document[dataName].get(player);
        if (typeof data === 'undefined') {
            return false;
        }

        if (typeof data.permissions === 'undefined') {
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
     * @param {alt.Player} player
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
        if (typeof data === 'undefined') {
            return false;
        }

        // Should return true if a permission is just an empty array.
        // Should also check this before checking player perms if they haven't had any perms added yet.
        if (perms.length <= 0) {
            return true;
        }

        if (typeof data.permissions === 'undefined') {
            return false;
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
     * @param {alt.Player} player
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
        if (typeof data === 'undefined') {
            return false;
        }

        // Should return true if a permission is just an empty array.
        // Should also check this before checking player perms if they haven't had any perms added yet.
        if (perms.length <= 0) {
            return true;
        }

        if (typeof data.permissions === 'undefined') {
            return false;
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

export const PermissionSystem = {
    character: {
        async add<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean> {
            return await InternalFunctions.add(player, perm, 'character');
        },
        async remove<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean> {
            return await InternalFunctions.remove(player, perm, 'character');
        },
        async clear(player: alt.Player) {
            return await InternalFunctions.clear(player, 'character');
        },
        has<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): boolean {
            return InternalFunctions.has(player, perm, 'character');
        },
        hasOne<CustomPerms = ''>(player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean {
            return InternalFunctions.hasOne(player, perms, 'character');
        },
        hasAll<CustomPerms = ''>(player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean {
            return InternalFunctions.hasAll(player, perms, 'character');
        },
    },
    account: {
        async add<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean> {
            return await InternalFunctions.add(player, perm, 'account');
        },
        async remove<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean> {
            return await InternalFunctions.remove(player, perm, 'account');
        },
        async clear(player: alt.Player) {
            return await InternalFunctions.clear(player, 'account');
        },
        has<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): boolean {
            return InternalFunctions.has(player, perm, 'account');
        },
        hasOne<CustomPerms = ''>(player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean {
            return InternalFunctions.hasOne(player, perms, 'account');
        },
        hasAll<CustomPerms = ''>(player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean {
            return InternalFunctions.hasAll(player, perms, 'account');
        },
    },
};
