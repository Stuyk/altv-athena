import { Permissions } from '../../shared/enums/permissions';

export interface Account {
    _id: string;
    discord: string;
    ips: Array<string>;
    hardware: Array<string>;
    lastLogin: number;
    permissionLevel: Permissions;
}
