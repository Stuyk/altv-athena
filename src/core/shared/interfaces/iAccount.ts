/**
 * Used to store Discord Information, IPs, and User Data
 *
 * @interface Account
 */
export interface Account {
    /**
     * A unique MongoDB identifier to identify the accoutn in the database.
     * @type {*}
     *
     */
    _id: any;

    /**
     * A incremented ID for individual accounts.
     * @type {number}
     *
     */
    id?: number;

    /**
     * Discord user ID. The one you get from developer mode.
     * @type {string}
     *
     */
    discord?: string;

    /**
     * Email bound to the discord account.
     * @type {string}
     *
     */
    email?: string;

    /**
     * Last 5 IPs that have logged into an account.
     * @type {Array<string>}
     *
     */
    ips: Array<string>;

    /**
     * Hardware Identifiers associated with an account.
     * @type {Array<string>}
     *
     */
    hardware: Array<string>;

    /**
     * Time in milliseconds when they last logged in since epoch.
     * @type {number}
     *
     */
    lastLogin: number;

    /**
     * A list of permissions assigned to this account.
     *
     * @type {Array<string>}
     *
     */
    permissions: Array<string>;

    /**
     * Is this user banned?
     * @type {boolean}
     *
     */
    banned: boolean;

    /**
     * Why are they banned?
     * @type {string}
     *
     */
    reason: string;
}
