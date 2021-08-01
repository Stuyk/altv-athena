import { PERMISSIONS, CHARACTER_PERMISSIONS } from '../flags/PermissionFlags';

export interface Command {
    name: string;
    description: string;
    permission?: PERMISSIONS;
    characterPermissions?: CHARACTER_PERMISSIONS;
    func?: Function;
}
