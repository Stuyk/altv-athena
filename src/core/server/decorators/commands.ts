import { Athena } from '../../server/api/athena';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';

/**
 * It takes in a command name, a description, and a permissions level, and then adds a command to the
 * chat controller
 * @param {string | Array<string>} commandName - The name or names of commands to register under one function
 * @param {string} description - The description of the command
 * @param {PERMISSIONS} permissions - PERMISSIONS
 * @returns A function that takes in 3 parameters.
 */
export function command(commandName: string | Array<string>, description: string, permissions: PERMISSIONS) {
    return (_target: Function, _propertyKey: string, descriptor: PropertyDescriptor) => {
        if (typeof commandName === 'string') {
            Athena.controllers.chat.addCommand(commandName, description, permissions, descriptor.value);
            return;
        }

        if (Array.isArray(commandName)) {
            for (let i = 0; i < commandName.length; i++) {
                Athena.controllers.chat.addCommand(commandName[i], description, permissions, descriptor.value);
            }
        }
    };
}
