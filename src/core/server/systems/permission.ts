import { Athena } from '@AthenaServer/api/athena';
import * as alt from 'alt-server';

type DefaultPerms = 'admin' | 'moderator';

export const PermissionSystem = {
    player: {
        /**
         * Add a permission to a player based on default permissions, or a custom permission.
         *
         * @template CustomPerms
         * @param {alt.Player} player
         * @param {(DefaultPerms | CustomPerms)} perm
         */
        async add<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean> {
            const accountData = Athena.document.account.get(player);
            if (typeof accountData === 'undefined') {
                return false;
            }

            const formattedPerm = String(perm).toLowerCase();
            const index = accountData.permissions.findIndex((x) => x === formattedPerm);
            if (index >= 0) {
                return false;
            }

            accountData.permissions.push(formattedPerm);
            await Athena.document.account.set(player, 'permissions', accountData.permissions);
            return true;
        },
        /**
         * Remove a permission from a player based on default permissions, or a custom permission.
         *
         * @template CustomPerms
         * @param {alt.Player} player
         * @param {(DefaultPerms | CustomPerms)} perm
         */
        async remove<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): Promise<boolean> {
            const accountData = Athena.document.account.get(player);
            if (typeof accountData === 'undefined') {
                return false;
            }

            const formattedPerm = String(perm).toLowerCase();
            const index = accountData.permissions.findIndex((x) => x === formattedPerm);
            if (index <= -1) {
                return false;
            }

            accountData.permissions.splice(index, 1);
            await Athena.document.account.set(player, 'permissions', accountData.permissions);
            return true;
        },
        /**
         * Check if a player has a permission.
         *
         * @template CustomPerms
         * @param {alt.Player} player
         * @param {(DefaultPerms | CustomPerms)} perm
         * @return {boolean}
         */
        has<CustomPerms = ''>(player: alt.Player, perm: DefaultPerms | CustomPerms): boolean {
            const accountData = Athena.document.account.get(player);
            if (typeof accountData === 'undefined') {
                return false;
            }

            if (typeof accountData.permissions === 'undefined') {
                return false;
            }

            if (accountData.permissions.length <= 0) {
                return false;
            }

            const formattedPerm = String(perm).toLowerCase();
            return accountData.permissions.findIndex((x) => x === formattedPerm) !== -1;
        },
        /**
         * Check if a player has at least one permission given an Array of permissions.
         *
         * @template CustomPerms
         * @param {alt.Player} player
         * @param {(Array<DefaultPerms | CustomPerms>)} perm
         * @return {boolean}
         */
        hasOne<CustomPerms = ''>(player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean {
            const accountData = Athena.document.account.get(player);
            if (typeof accountData === 'undefined') {
                return false;
            }

            if (typeof accountData.permissions === 'undefined') {
                return false;
            }

            if (accountData.permissions.length <= 0) {
                return false;
            }

            for (let perm of perms) {
                const index = accountData.permissions.findIndex((x) => x === perm);
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
        hasAll<CustomPerms = ''>(player: alt.Player, perms: Array<DefaultPerms | CustomPerms>): boolean {
            const accountData = Athena.document.account.get(player);
            if (typeof accountData === 'undefined') {
                return false;
            }

            if (typeof accountData.permissions === 'undefined') {
                return false;
            }

            if (accountData.permissions.length <= 0) {
                return false;
            }

            for (let perm of perms) {
                const index = accountData.permissions.findIndex((x) => x === perm);
                if (index <= -1) {
                    return false;
                }

                continue;
            }

            return true;
        },
    },
};
