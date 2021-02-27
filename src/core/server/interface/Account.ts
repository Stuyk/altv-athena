import { ObjectId } from 'bson';
import { Permissions } from '../../shared/flags/permissions';

/**
 * Used to store Discord Information, IPs, and User Data
 * @export
 * @interface Account
 */
export interface Account {
    _id: any;
    discord: string;
    ips: Array<string>;
    hardware: Array<string>;
    lastLogin: number;
    permissionLevel: Permissions;
    quickToken: string;
    quickTokenExpiration: number;
    banned: boolean;
    reason: string;
}
