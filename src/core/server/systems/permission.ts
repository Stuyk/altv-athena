import { isFlagEnabled } from '@AthenaShared/utility/flags';

type PermissionStrategy = 'matching_roles' | 'inherited_roles';

let strategy: PermissionStrategy = 'matching_roles';

export const Permission = {
    /**
     * Should be set during the server startup phase to change player permission strategies.
     * This will apply to all players when they select a character.
     * DO NOT CHANGE THIS AFTER SERVER STARTUP.
     *
     * @param {PermissionStrategy} _strategy
     * @memberof Permission
     */
    setPermissionStrategy(_strategy: PermissionStrategy) {
        strategy = _strategy;
    },

    /**
     * Returns if permission is granted based on current strategy.
     *
     * @param {Permissions} permission
     * @param {Permissions} permissionToCheck
     * @return {boolean}
     * @memberof Permission
     */
    isPermissionValidByStrategy(permission: Permissions | number, permissionToCheck: Permissions | number): boolean {
        if (strategy === 'matching_roles') {
            return isFlagEnabled(permission, permissionToCheck);
        }

        if (strategy === 'inherited_roles') {
            if (permission >= permissionToCheck) {
                return true;
            }
        }

        return false;
    },
};
