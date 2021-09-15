import { ObjectId } from 'bson';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';

/**
 * Used to store Discord Information, IPs, and User Data
 * @export
 * @interface Account
 */
export interface Account {
    _id: any;
    discord: string;
    email: string;
    ips: Array<string>;
    hardware: Array<string>;
    lastLogin: number;
    permissionLevel: PERMISSIONS;
    quickToken: string;
    quickTokenExpiration: number;
    banned: boolean;
    reason: string;
}
