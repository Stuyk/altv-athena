import sjcl from 'sjcl';
import ecc from 'elliptic'

const elliptic = new ecc.ec('curve25519');

let privateKey: string;
let publicKey: string;
let azurePubKey: string;

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
    return sha256(`${data} + ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`);
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

export function encryptData(jsonData: string): sjcl.SjclCipherEncrypted | null {
    const sharedSecret = getSharedSecret();

    try {
        const partialEncryption = sjcl.encrypt(sharedSecret, jsonData, { mode: 'gcm' });
        const safeEncryption = partialEncryption.replace(/\+/g, '_')
        return safeEncryption;
    } catch (err) {
        return null;
    }
}

export function decryptData(jsonData: string): string | null {
    const sharedSecret = getSharedSecret();

    try {
        const cleanedEncryption = jsonData.replace(/\_/g, '+');
        return sjcl.decrypt(sharedSecret, cleanedEncryption, { mode: 'gcm' });
    } catch (err) {
        return null;
    }
}

export function getSharedSecret(): string | boolean {
    if (!azurePubKey) {
        throw new Error(`azurePubKey was not set.`);
    }

    try {
        const ecPrivateKey: ecc.KeyPair = elliptic.keyFromPrivate(getPrivateKey(), 'hex');
        const ecPublicKey: ecc.KeyPair = elliptic.keyFromPublic(azurePubKey, 'hex');
        const sharedKey = ecPrivateKey.derive(ecPublicKey.getPublic()).toString(16);
        return sharedKey;
    } catch (err) {
      console.error(err);
      return false
    }
}

export function setAzurePublicKey(azurePublicKey: string) {
    azurePubKey = azurePublicKey;
}

export function getAzurePublicKey() {
    return azurePubKey;
}
  