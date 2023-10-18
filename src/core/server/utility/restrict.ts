import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

/**
 * Used to build a restricted function.
 *
 *
 * @interface Restrictions
 */
export interface Restrictions {
    permissions: {
        account: Array<string>;
        character: Array<string>;
    };
    /**
     * hasOne - Checks if character, or account has a given permission
     * hasAll - Expects all permissions to exist on character && account
     *
     * @type {('hasOne' | 'hasAll')}
     *
     */
    strategy: 'hasOne' | 'hasAll';
    /**
     * What to tell the user if they are restricted
     *
     * @type {string}
     *
     */
    notify?: string;

    /**
     * Kick the player if they do not have permission
     *
     * @type {boolean}
     * @memberof Restrictions
     */
    kickOnBadPermission?: {
        /**
         * What do we tell them when they are kicked
         *
         * @type {string}
         */
        kickMessage: string;

        /**
         * What to tell console when they are kicked.
         *
         * Player name is automatically appended to the beginning.
         *
         * @type {string}
         */
        consoleMessage: string;
    };
}

function verifyRestrictions(player: alt.Player, restrictions: Restrictions): boolean {
    const data = Athena.document.character.get(player);
    if (!data) {
        return false;
    }

    let hasCharacterPerms = false;
    let hasAccountPerms = false;
    let passed = false;

    if (restrictions.strategy === 'hasAll') {
        if (restrictions.permissions.character.length >= 0) {
            hasCharacterPerms = Athena.systems.permission.hasAll(
                'character',
                player,
                restrictions.permissions.character,
            );
        } else {
            hasCharacterPerms = true;
        }

        if (restrictions.permissions.account.length >= 0) {
            hasAccountPerms = Athena.systems.permission.hasAll('account', player, restrictions.permissions.account);
        } else {
            hasAccountPerms = true;
        }

        if (hasCharacterPerms && hasAccountPerms) {
            passed = true;
        }
    }

    if (restrictions.strategy === 'hasOne') {
        if (restrictions.permissions.account.length >= 0) {
            hasAccountPerms = Athena.systems.permission.hasOne('account', player, restrictions.permissions.account);
        } else {
            hasAccountPerms = true;
        }

        if (restrictions.permissions.character.length >= 0) {
            hasCharacterPerms = Athena.systems.permission.hasOne(
                'character',
                player,
                restrictions.permissions.character,
            );
        } else {
            hasCharacterPerms = true;
        }

        if (hasCharacterPerms || hasAccountPerms) {
            passed = true;
        }
    }

    if (!passed && restrictions.notify) {
        Athena.player.emit.notification(player, restrictions.notify);
    }

    if (!passed && restrictions.kickOnBadPermission) {
        alt.logWarning(`${data.name} ${restrictions.kickOnBadPermission.consoleMessage}`);

        if (player && player.valid) {
            player.kick(restrictions.kickOnBadPermission.kickMessage);
        }

        return false;
    }

    return passed;
}

/**
 * Wraps a function and creates restrictions on that function.
 *
 * Always call the restricted function to invoke an automatic check against given permission strategy.
 *
 * First argument of the handler must always be a player.
 *
 * ```ts
 * function doPoliceWork(player: alt.Player) {
 *   // Restricted to characters who have 'police' permission
 *   // OR
 *   // Restricted to accounts who have 'admin' permission
 * }
 *
 * const doPoliceWorkRestricted = Athena.utility.restrict.create(doPoliceWork, {
 *     strategy: 'hasOne',
 *     permissions: { account: ['admin'], character: ['police'] },
 *     notify: 'You are not part of the police force.',
 * });
 *
 * alt.onClient('something-from-a-client', doPoliceWorkRestricted);
 * ```
 *
 *
 * @template T
 * @param {T} handler
 * @param {Restrictions} restrictions
 * @return {T}
 */
export function create<T = (player: alt.Player, ...args: any[]) => void>(handler: T, restrictions: Restrictions): T {
    const newFunction = (target: alt.Player, ...invokedArgs: any[]) => {
        if (!(target instanceof alt.Player)) {
            return;
        }

        if (!target || !target.valid) {
            return;
        }

        if (!verifyRestrictions(target, restrictions)) {
            return;
        }

        if (typeof handler !== 'function') {
            return;
        }

        return handler(target, ...invokedArgs);
    };

    return newFunction as T;
}

interface RestrictFuncs {
    create: typeof create;
}

const Overrides: Partial<RestrictFuncs> = {};

export function override(functionName: 'create', callback: typeof create);
/**
 * Used to override restrict utility funcs
 *
 *
 * @param {keyof RestrictFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof RestrictFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
