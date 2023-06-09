import { Account } from '@AthenaShared/interfaces/iAccount';

export interface AccountEx extends Account {
    /**
     * The username associated with the account.
     *
     * @type {string}
     * @memberof AccountEx
     */
    username: string;

    /**
     * A password used to login to the account.
     *
     * @type {string}
     * @memberof AccountEx
     */
    password: string;

    /**
     * A recovery phrase used to restore an account.
     *
     * This is only shown to the user once.
     *
     * @type {string}
     * @memberof AccountEx
     */
    recovery: string;
}
