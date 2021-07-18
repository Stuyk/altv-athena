import * as alt from 'alt-server';
import axios from 'axios';
import ecc from 'elliptic';
import sjcl from 'sjcl';

import { sha256 } from './encryption';

const elliptic = new ecc.ec('curve25519');

let aresEndpoint: string;
let privateKey: string;
let publicKey: string;
let aresPublicKey: string;
let sharedSecret: string;

export default class Ares {
    /**
     * Creates our local private and public key.
     * @static
     * @return {string}
     * @memberof Ares
     */
    static getPublicKey(): string {
        if (!privateKey) {
            privateKey = elliptic.genKeyPair().getPrivate().toString(16);
        }

        if (!publicKey) {
            publicKey = elliptic.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex', true);
        }

        return publicKey;
    }

    /**
     * Creates or gets our local private key.
     * @static
     * @return {string}
     * @memberof Ares
     */
    static getPrivateKey(): string {
        if (!privateKey) {
            privateKey = elliptic.genKeyPair().getPrivate().toString(16);
        }

        return privateKey;
    }

    /**
     * Encrypts data using the shared secret from the Ares service.
     * @static
     * @param {string} jsonData
     * @return {Promise<any>}
     * @memberof Ares
     */
    static async encrypt(jsonData: string): Promise<any> {
        const sharedSecret = await Ares.getSharedSecret();

        try {
            const partialEncryption = sjcl.encrypt(sharedSecret, jsonData, { mode: 'gcm' });
            const safeEncryption = partialEncryption.replace(/\+/g, '_');
            return safeEncryption;
        } catch (err) {
            return null;
        }
    }

    /**
     * Decrypts data using the shared secret from the Ares service.
     * @static
     * @param {string} jsonData
     * @return {*}  {Promise<any>}
     * @memberof Ares
     */
    static async decrypt(jsonData: string): Promise<any> {
        const sharedSecret = await Ares.getSharedSecret();

        try {
            const cleanedEncryption = jsonData.replace(/\_/g, '+');
            return sjcl.decrypt(sharedSecret, cleanedEncryption, { mode: 'gcm' });
        } catch (err) {
            return null;
        }
    }

    /**
     * Generates a shared secret and creates a local private and public key if necessary.
     * Returns the generated shared secret after establishing a connection.
     * @static
     * @return {(Promise<string | boolean>)}
     * @memberof Ares
     */
    static async getSharedSecret(): Promise<string | boolean> {
        if (sharedSecret) {
            return sharedSecret;
        }

        const privateKey = await Ares.getPrivateKey();
        const publicKey = await Ares.getAresPublicKey();

        try {
            const ecPrivateKey: ecc.KeyPair = elliptic.keyFromPrivate(privateKey, 'hex');
            const ecPublicKey: ecc.KeyPair = elliptic.keyFromPublic(publicKey, 'hex');
            const sharedKey = ecPrivateKey.derive(ecPublicKey.getPublic()).toString(16);
            sharedSecret = sharedKey;
            return sharedSecret;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * Sets the current REST API to speak to for keys and such.
     * @static
     * @param {string} endpoint
     * @memberof Ares
     */
    static setAresEndpoint(endpoint: string): void {
        aresEndpoint = endpoint;
    }

    /**
     * Gets the current Ares Endpoint
     * @static
     * @return {*}  {string}
     * @memberof Ares
     */
    static getAresEndpoint(): string {
        if (!aresEndpoint) {
            throw new Error(`Failed to load Azure Endpoint.`);
        }

        return aresEndpoint;
    }

    /**
     * Returns the ares public key from the REST Service.
     * @static
     * @return {Promise<string | null>}
     * @memberof Ares
     */
    static async getAresPublicKey(): Promise<string | null> {
        if (aresPublicKey) {
            return aresPublicKey;
        }

        const result = await axios.get(`${aresEndpoint}/v1/get/key`).catch((err) => {
            return null;
        });

        if (!result || !result.data || !result.data.key) {
            return await Ares.getAresPublicKey();
        }

        aresPublicKey = result.data.key;
        return aresPublicKey;
    }

    /**
     * Returns the current version of the Ares protocol.
     * @static
     * @return {(Promise<string | null>)}
     * @memberof Ares
     */
    static async getVersion(): Promise<string | null> {
        const result = await axios.get(`${Ares.getAresEndpoint()}/v1/get/version`).catch((err) => {
            return null;
        });

        if (!result || !result.data) {
            return null;
        }

        return result.data;
    }

    /**
     * Hashes some unique player data.
     * @static
     * @param {alt.Player} player
     * @param {string} discord
     * @return {*}  {string}
     * @memberof Ares
     */
    static getUniquePlayerHash(player: alt.Player, discord: string): string {
        return sha256(sha256(`${player.hwidHash}${player.hwidExHash}${player.ip}${discord}${player.socialID}`));
    }
}
