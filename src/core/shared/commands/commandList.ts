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
        description: '/me [describe what you are doing] - Roleplay an action',
        cooldown: 0,
        permission: Permissions.None
    },
    {
        name: 'do',
        description: '/do [describe an object] - Describe something',
        cooldown: 0,
        permission: Permissions.None
    },
    {
        name: 'low',
        description: '/low [quietly speak something]',
        cooldown: 0,
        permission: Permissions.None
    },
    {
        name: 'w',
        description: '/w [player_id] [message] - Whisper',
        cooldown: 0,
        permission: Permissions.None
    },
    // Admin+
    {
        name: 'getvehicle',
        description: '/getvehicle [name] - Spawn an admin vehicle',
        cooldown: 0,
        permission: Permissions.Admin
    },
    {
        name: 'sethealth',
        description: '/sethealth [99 - 200] [player_id]* - Set health for self or others',
        cooldown: 0,
        permission: Permissions.Admin | Permissions.Moderator
    },
    {
        name: 'setarmour',
        description: '/setarmour [0 - 100] [player_id]* - Set armour for self or others',
        cooldown: 0,
        permission: Permissions.Admin | Permissions.Moderator
    },
    {
        name: 'revive',
        description: '/revive [player_id]* - Revive self or others',
        cooldown: 0,
        permission: Permissions.Admin | Permissions.Moderator
    },
    {
        name: 'noclip',
        description: '/noclip -  Toggles noclip mode.',
        cooldown: 0,
        permission: Permissions.Admin
    },
    {
        name: 'updateweather',
        description: '/updateweather - Forcefully updates your weather based on region.',
        cooldown: 0,
        permission: Permissions.Admin
    }
];

/**
 * Returns a description of the command.
 * Mostly used for constructing commands in 'server/commands/...'
 * @export
 * @param {string} commandName
 * @return {*}  {string}
 */
export function getDescription(commandName: string): string {
    const index = commandList.findIndex((x) => x.name === commandName);

    if (index <= -1) {
        return `${commandName} does not have a description.`;
    }

    return commandList[index].description;
}
