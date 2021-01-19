import { Permissions } from '../flags/permissions';

export interface Command {
    name: string;
    description: string;
    permission: Permissions;
    func?: Function;
}
