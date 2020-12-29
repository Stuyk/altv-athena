import { Permissions } from '../enums/permissions';
import { Command } from '../interfaces/Command';

export const commandList: Array<Command> = [
    { name: 'sethp', description: '/setp <101 - 200>', cooldown: 0, permission: Permissions.Admin },
    { name: 'setarmour', description: '/setarmour <0-100>', cooldown: 0, permission: Permissions.Admin },
    { name: 'revive', description: '/revive', cooldown: 0, permission: Permissions.Admin }
];
