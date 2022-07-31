import * as alt from 'alt-server';
import {ATHENA_EVENTS_PLAYER} from '../../shared/enums/athenaEvents';
import {PLAYER_SYNCED_META} from '../../shared/enums/playerSynced';
import {PlayerEvents} from '../events/playerEvents';
import {isFlagEnabled} from "../../shared/utility/flags";
import {PERMISSIONS} from "../../shared/flags/permissionFlags";

type PermissionStrategy = 'matching_roles' | 'inherited_roles';

let strategy: PermissionStrategy = 'matching_roles';

export class Permission {

    /**
     * Should be set during the server startup phase to change player permission strategies.
     * This will apply to all players when they select a character.
     * DO NOT CHANGE THIS AFTER SERVER STARTUP.
     *
     * @static
     * @param {PermissionStrategy} _strategy
     * @memberof Permission
     */
    static setPermissionStrategy(_strategy: PermissionStrategy) {
        strategy = _strategy;
    }

    /**
     * Returns if permission is granted based on current strategy.
     *
     * @static
     * @param {Permissions} permission
     * @param {Permissions} permissionToCheck
     * @return {boolean}
     * @memberof Permission
     */
    static isPermissionValidByStrategy(permission: Permissions | number, permissionToCheck: Permissions | number): boolean {

        if (strategy === 'matching_roles') {
            return isFlagEnabled(
                permission,
                permissionToCheck,
            );
        }

        if (strategy === 'inherited_roles') {
            if (permission >= permissionToCheck) {
                return true;
            }
        }

        return false;
    }
}

