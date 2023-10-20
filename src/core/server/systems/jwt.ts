import * as alt from 'alt-server';
import nJWT from 'njwt';

import * as Athena from '@AthenaServer/api/index.js';
import { Account } from '../../shared/interfaces/iAccount.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';

// Do not change; it is just a key to lookup in the database.
const JWT_SECRET_KEY = 'jwtSecret';
const JWT_CREATION_KEY = 'jwtSecretExpiration';
const TIME_TO_EXPIRE = 60000 * 60 * 24; // 24 Hours
const JWT_CUSTOM_KEY_ENTRY = 'account_id';
const fetchRequests: { [key: string]: string | undefined } = {};

let secret: string;
let expiration: number;

/**
 * Keep function private. Do not expose.
 *
 * @return {Promise<string>}
 */
async function getSecret(): Promise<string> {
    // Return current secret quickly.
    if (typeof expiration !== 'undefined' && Date.now() < expiration && typeof secret === 'string') {
        return secret;
    }

    // Setup new secret / get from database first time
    secret = await Athena.systems.global.getKey<string>(JWT_SECRET_KEY);
    expiration = await Athena.systems.global.getKey<number>(JWT_CREATION_KEY);

    const isUndefinedData = typeof secret === 'undefined' || secret === null;
    const isExpired = typeof expiration === 'undefined' || Date.now() > expiration;

    if (isUndefinedData || isExpired) {
        secret = Athena.utility.hash.sha256Random(JSON.stringify(Math.random() * Number.MAX_SAFE_INTEGER));
        await Athena.systems.global.setKey(JWT_SECRET_KEY, secret);
        await Athena.systems.global.setKey(JWT_CREATION_KEY, Date.now() + TIME_TO_EXPIRE);
    }

    return secret;
}

/**
 * Writes the token to memory for usage.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(string | null)} token
 */
function handleFetchRequest(player: alt.Player, token: string | null) {
    fetchRequests[player.id] = token;
}

/**
 * Creates a JWT token with basic account id inside of it.
 *
 * @param {Account} account
 * @return {(Promise<undefined | string>)}
 */
export async function create(account: Account): Promise<undefined | string> {
    if (Overrides.create) {
        return Overrides.create(account);
    }

    if (!account || !account._id) {
        return undefined;
    }

    const secret = await getSecret();
    const claims = {
        scope: 'users',
    };
    const jwt = nJWT.create(claims, secret);
    jwt.setExpiration(Date.now() + TIME_TO_EXPIRE);
    jwt.setClaim(JWT_CUSTOM_KEY_ENTRY, account._id.toString());
    return jwt.compact();
}

/**
 * Verifies a compact JWT string is valid.
 *
 * @param {string} data
 * @return {(Promise<string | undefined>)}
 */
export async function verify(data: string): Promise<string | undefined> {
    if (Overrides.verify) {
        return Overrides.verify(data);
    }

    const secret = await getSecret();
    let verifiedJWT: nJWT.Jwt;

    try {
        verifiedJWT = nJWT.verify(data, secret);
    } catch (err) {
        return undefined;
    }

    // Returns the current secret as a string for usage.
    return verifiedJWT.body[JWT_CUSTOM_KEY_ENTRY];
}

export async function fetch(player: alt.Player): Promise<string | null> {
    if (Overrides.fetch) {
        return Overrides.fetch(player);
    }

    if (!player || !player.valid) {
        return null;
    }

    const id = player.id;

    fetchRequests[id] = undefined;
    alt.emitClient(player, SYSTEM_EVENTS.QUICK_TOKEN_FETCH);
    await new Promise((resolve: Function) => {
        let attempts = 0;
        const interval = alt.setInterval(() => {
            if (typeof fetchRequests[id] !== 'undefined') {
                alt.clearInterval(interval);
                return resolve();
            }

            if (typeof fetchRequests[id] === null) {
                alt.clearInterval(interval);
                return resolve();
            }

            if (attempts >= 100) {
                alt.clearInterval(interval);
                return resolve();
            }

            attempts += 1;
        }, 250);
    });

    if (!player || !player.valid) {
        return null;
    }

    const result = fetchRequests[id];

    alt.nextTick(() => {
        delete fetchRequests[id];
    });

    return result;
}

interface JwtFuncs {
    create: typeof create;
    verify: typeof verify;
    fetch: typeof fetch;
}

const Overrides: Partial<JwtFuncs> = {};

export function override(functionName: 'create', callback: typeof create);
export function override(functionName: 'verify', callback: typeof verify);
export function override(functionName: 'fetch', callback: typeof fetch);
/**
 * Used to override jwt functions.
 *
 *
 * @param {keyof JwtFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JwtFuncs, callback: any): void {
    Overrides[functionName] = callback;
}

alt.onClient(SYSTEM_EVENTS.QUICK_TOKEN_FETCH, handleFetchRequest);
