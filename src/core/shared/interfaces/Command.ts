import { Permissions, CharacterPermissions } from '../flags/permissions';

export interface Command {
    name: string;
    description: string;
    permission?: Permissions;
    characterPermissions?: CharacterPermissions;
    func?: Function;
}
