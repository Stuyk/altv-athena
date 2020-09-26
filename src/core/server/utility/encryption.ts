import * as sjcl from 'sjcl';

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
    const hasher: sjcl.SjclHash = new sjcl.hash.sha256();
    const hashBytes: sjcl.BitArray = hasher.update(data).finalize();
    return sjcl.codec.hex.fromBits(hashBytes);
}

/**
 * Hash a string of data into a random SHA256 hash.
 *
 * @param  {string} data
 * @returns string
 */
export function sha256Random(data: string): string {
    const hasher: sjcl.SjclHash = new sjcl.hash.sha256();
    const hashBytes: sjcl.BitArray = hasher
        .update(`${data}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`)
        .finalize();

    return sjcl.codec.hex.fromBits(hashBytes);
}
