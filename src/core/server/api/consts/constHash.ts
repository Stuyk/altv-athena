import { hashPassword, sha256, sha256Random, testPassword } from '../../utility/encryption';

export const hashConst = {
    sha256: sha256,
    sha256Random: sha256Random,
    testPassword: testPassword,
    hashPassword: hashPassword,
};
