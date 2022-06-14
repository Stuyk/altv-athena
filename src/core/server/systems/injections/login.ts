import * as alt from 'alt-server';
import { Account } from '../../interface/iAccount';
import { Injections } from '../injections';

export enum LoginInjectionNames {
    TRY_LOGIN_ACCOUNT_BEGIN = 'login-try-account-begin',
    TRY_LOGIN_ACCOUNT_END = 'login-try-account-end',
    TRY_QUICK_TOKEN = 'login-try-quick-token-end',
}

type tryLoginTypes = `${LoginInjectionNames.TRY_LOGIN_ACCOUNT_BEGIN}` | `${LoginInjectionNames.TRY_LOGIN_ACCOUNT_END}`;
type tryQuickTokenTypes = `${LoginInjectionNames.TRY_QUICK_TOKEN}`;

export type TryLoginCallback = (player: alt.Player, account: Partial<Account> | undefined) => Promise<boolean>;
export type TryQuickTokenCallback = (player: alt.Player, discord: string | undefined) => Promise<boolean>;

/**
 * Called when the user has authenticated; but is trying to generate account information.
 *
 * `Account` in the callback can be undefined.
 *
 * Before is when the account hasn't looked up account information yet.
 * After is when the account has the account information.
 *
 * @param {tryLoginTypes} type
 * @param {TryLoginCallback} callback
 */
function tryLogin(type: tryLoginTypes, callback: TryLoginCallback) {
    Injections.add(type, callback);
}

/**
 * Called after the quick token has successfully been used.
 *
 * @param {tryQuickTokenTypes} type
 * @param {TryQuickTokenCallback} callback
 */
function tryQuickToken(type: tryQuickTokenTypes, callback: TryQuickTokenCallback) {
    Injections.add(type, callback);
}

export const LoginInjections = {
    tryLogin,
    tryQuickToken,
};
