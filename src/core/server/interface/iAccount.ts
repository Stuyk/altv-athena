import { PERMISSIONS } from '../../shared/flags/permissionFlags';

/**
 * Used to store Discord Information, IPs, and User Data
 * @export
 * @interface Account
 */
export interface Account {
    /**
     * A unique MongoDB identifier to identify the accoutn in the database.
     * @type {*}
     * @memberof Account
     */
    _id: any;

    /**
     * A incremented ID for individual accounts.
     * @type {number}
     * @memberof Account
     */
    id?: number;

    /**
     * Discord user ID. The one you get from developer mode.
     * @type {string}
     * @memberof Account
     */
    discord?: string;

    /**
     * Email bound to the discord account.
     * @type {string}
     * @memberof Account
     */
    email?: string;

    /**
     * Last 5 IPs that have logged into an account.
     * @type {Array<string>}
     * @memberof Account
     */
    ips: Array<string>;

    /**
     * Hardware Identifiers associated with an account.
     * @type {Array<string>}
     * @memberof Account
     */
    hardware: Array<string>;

    /**
     * Time in milliseconds when they last logged in since epoch.
     * @type {number}
     * @memberof Account
     */
    lastLogin: number;

    /**
     * What administrative permissions does this account have.
     * Default: 0
     * @type {PERMISSIONS}
     * @memberof Account
     */
    permissionLevel: PERMISSIONS;

    /**
     * Is this user banned?
     * @type {boolean}
     * @memberof Account
     */
    banned: boolean;

    /**
     * Why are they banned?
     * @type {string}
     * @memberof Account
     */
    reason: string;
}
