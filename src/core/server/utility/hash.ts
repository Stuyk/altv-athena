import sjcl from 'sjcl';

/**
 * Hash a plain text password with pbkdf2 hash and salt.
 *
 * Returns a pbkdf2 key, and salt. Which can be seperated by the `$` sign.
 *
 * #### Example
 * ```ts
 * const result = Athena.utility.hash.hashPassword('somePassword');
 * ```
 *
 * @param  {string} plainTextPassword
 * @returns {string}
 */
export function hashPassword(plainTextPassword: string): string {
    const saltBits = sjcl.random.randomWords(128, 0);
    const salt = sjcl.codec.base64.fromBits(saltBits);
    const key = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256));
    return `${key}$${salt}`;
}

/**
 * Test a plain text password against a stored pbkdf2 string.
 *
 * #### Example
 * ```ts
 * // Actual pbkdf2Hash is just mock string
 * const doesMatch = Athena.utility.hash.testPassword('test', 'kjfdskljfsdkl$90jj0f10f21f1')
 * ```
 *
 * @param  {string} plainTextPassword
 * @param  {string} pbkdf2Hash
 * @returns {boolean}
 */
export function testPassword(plainTextPassword: string, pbkdf2Hash: string): boolean {
    const [_key, _salt] = pbkdf2Hash.split('$');
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);
    return _key === derivedBaseKey;
}

/**
 * Hash a string of data into a persistent SHA256 hash.
 *
 * @param  {string} data
 * @returns {string}
 */
export function sha256(data: string): string {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
}

/**
 * Hash a string of data into a random SHA256 hash.
 *
 * @param  {string} data
 * @returns {string}
 */
export function sha256Random(data: string): string {
    const randomValue = Math.random();
    return sha256(`${data} + ${randomValue}`);
}

export default { sha256, sha256Random, testPassword, hashPassword };
