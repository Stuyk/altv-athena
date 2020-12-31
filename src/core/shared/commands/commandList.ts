import { Permissions } from '../enums/permissions';
import { Command } from '../interfaces/Command';

/*
 * When you define your commands here they have a permission level.
 * This permission level uses bit-wise flags.
 * If you want two or more ranks to access a command you simply use a '|' to seperate them.
 * This makes it clean and easy to setup permissions for different commands.
 *
 * ie. Permissions.Admin | Permissions.Moderator will give those two permission levels access.
 * ie. Permissions.Admin will only allow the admin to access a command.
 * ie. Permissions.Moderator will only allow the moderator to access a command.
 *
 * There is no hierachy so you can really customize commands heavily.
 * If you want a command accessible by everyone use None.
 */

export const commandList: Array<Command> = [
    {
        name: 'me',
        description: '/me <describe what you are doing>',
        cooldown: 0,
        permission: Permissions.None
    },
    // Admin+
    {
        name: 'sethealth',
        description: '/sethealth <101 - 200> <player_id>',
        cooldown: 0,
        permission: Permissions.Admin | Permissions.Moderator
    },
    {
        name: 'setarmour',
        description: '/setarmour <0 - 100> <player_id>',
        cooldown: 0,
        permission: Permissions.Admin | Permissions.Moderator
    },
    {
        name: 'revive',
        description: '/revive <player_id>',
        cooldown: 0,
        permission: Permissions.Admin | Permissions.Moderator
    }
];
