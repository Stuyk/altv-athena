import { Permissions } from '../../shared/enums/permissions';

/**
 * Used to store Discord Information, IPs, and User Data
 * @export
 * @interface Account
 */
export interface Account {
    _id: string;
    discord: string;
    ips: Array<string>;
    hardware: Array<string>;
    lastLogin: number;
    permissionLevel: Permissions;
    quickToken: string;
    quickTokenExpiration: number;
}
