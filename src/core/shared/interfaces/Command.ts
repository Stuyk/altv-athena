import { Permissions } from '../enums/permissions';

export interface Command {
    name: string;
    description: string;
    permission: Permissions;
    cooldown: number;
    func?: Function;
}
