import { Permissions } from '../enums/permissions';
import { Command } from '../interfaces/Command';

export const commandList: Array<Command> = [
    {
        name: 'sethealth',
        description: '/sethealth <101 - 200> <player_id>',
        cooldown: 0,
        permission: Permissions.Admin
    },
    { name: 'setarmour', description: '/setarmour <0 - 100> <player_id>', cooldown: 0, permission: Permissions.Admin },
    { name: 'revive', description: '/revive <player_id>', cooldown: 0, permission: Permissions.Admin }
];
