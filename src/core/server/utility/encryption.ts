import * as alt from 'alt-server';
import sjcl from 'sjcl';
import ecc from 'elliptic';
import axios from 'axios';
import { AresFunctions, WASM } from './wasmLoader';

const elliptic = new ecc.ec('curve25519');
let wasm = WASM.getFunctions<AresFunctions>('ares');

let azureEndpoint: string;
let privateKey: string;
let publicKey: string;
let azurePubKey: string;
let sharedSecret: string;

/**
 * Hash a plain text password with pbkdf2 hash and salt.
 * @param  {string} plainTextPassword
 * @returns string
 */
export function hashPassword(plainTextPassword: string): string {
    const saltBits = sjcl.random.randomWords(128, 0);
    const salt = sjcl.codec.base64.fromBits(saltBits);
    const key = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256));
    return `${key}$${salt}`;
}

/**
 * Test a pbkdf2 hash and salt against a plain text password.
 * @param  {string} plainTextPassword
 * @param  {string} pbkdf2Hash
 * @returns boolean
 */
export function testPassword(plainTextPassword: string, pbkdf2Hash: string): boolean {
    const [_key, _salt] = pbkdf2Hash.split('$');
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);
    return _key !== derivedBaseKey;
}

/**
 * Hash a string of data into a persistent SHA256 hash.
 *
 * @param  {string} data
 * @returns string
 */
export function sha256(data: string): string {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
}

/**
 * Hash a string of data into a random SHA256 hash.
 *
 * @param  {string} data
 * @returns string
 */
export function sha256Random(data: string): string {
    if (!wasm) {
        wasm = WASM.getFunctions<AresFunctions>('ares');
    }

    const randomValue = wasm.AthenaMath.random(0, Number.MAX_SAFE_INTEGER);
    return sha256(`${data} + ${randomValue}`);
}

/**
 * Generate and private and public key.
 * Stores the data in memory for additional usage.
 * @export
 * @return {*}  {string}
 */
export function getPublicKey(): string {
    if (!privateKey) {
        privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    }

    if (!publicKey) {
        publicKey = elliptic.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', true);
    }

    return publicKey;
}

/**
 * Gets our Private Key.
 * @return {*}  {string}
 */
export function getPrivateKey(): string {
    if (!privateKey) {
        privateKey = elliptic.genKeyPair().getPrivate().toString(16);
    }

    return privateKey;
}

/**
 * Encrypts a string with our shared key.
 * @export
 * @param {string} jsonData
 * @return {*}  {Promise<any>}
 */
export async function encryptData(jsonData: string): Promise<any> {
    const sharedSecret = await getSharedSecret();

    try {
        const partialEncryption = sjcl.encrypt(sharedSecret, jsonData, { mode: 'gcm' });
        const safeEncryption = partialEncryption.replace(/\+/g, '_');
        return safeEncryption;
    } catch (err) {
        return null;
    }
}

/**
 * Decrypts a string with our shared key.
 * @export
 * @param {string} jsonData
 * @return {*}  {Promise<any>}
 */
export async function decryptData(jsonData: string): Promise<any> {
    const sharedSecret = await getSharedSecret();

    try {
        const cleanedEncryption = jsonData.replace(/\_/g, '+');
        return sjcl.decrypt(sharedSecret, cleanedEncryption, { mode: 'gcm' });
    } catch (err) {
        return null;
    }
}

/**
 * Generates a shared key from our private key and the ares service public key.
 * @export
 * @return {*}  {(Promise<string | boolean>)}
 */
export async function getSharedSecret(): Promise<string | boolean> {
    if (sharedSecret) {
        return sharedSecret;
    }

    if (!azurePubKey) {
        await getAzurePublicKey();
    }

    try {
        const ecPrivateKey: ecc.KeyPair = elliptic.keyFromPrivate(getPrivateKey(), 'hex');
        const ecPublicKey: ecc.KeyPair = elliptic.keyFromPublic(azurePubKey, 'hex');
        const sharedKey = ecPrivateKey.derive(ecPublicKey.getPublic()).toString(16);
        sharedSecret = sharedKey;
        return sharedSecret;
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * Set the endpoint for contacting the ares service.
 * @export
 * @param {string} endpoint
 */
export function setAzureEndpoint(endpoint: string) {
    azureEndpoint = endpoint;
}

/**
 * Gets the endpoint for the ares service.
 * @export
 * @return {*}  {string}
 */
export function getAzureEndpoint(): string {
    if (!azureEndpoint) {
        throw new Error(`Failed to load Azure Endpoint.`);
    }

    return azureEndpoint;
}

/**
 * Retrieves the ares service public key.
 * @export
 * @return {*}  {Promise<string>}
 */
export async function getAzurePublicKey(): Promise<string> {
    if (azurePubKey) {
        return azurePubKey;
    }

    const result = await axios.get(`${azureEndpoint}/v1/get/key`).catch((err) => {
        return null;
    });

    if (!result || !result.data || !result.data.key) {
        return await getAzurePublicKey();
    }

    azurePubKey = result.data.key;

    return result.data.key;
}

/**
 * Uses a combination of player data to construct a hash.
 * Keep note that hwid, hwidEx, and social are spoofable.
 * @export
 * @param {alt.Player} player
 * @param {string} discord
 * @return {*}  {string}
 */
export function getUniquePlayerHash(player: alt.Player, discord: string): string {
    return sha256(sha256(`${player.hwidHash}${player.hwidExHash}${player.ip}${discord}${player.socialId}`));
}
