
import { Athena } from '../../server/api/athena';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { ConsoleCommander } from '../../shared/utility/consoleCommander';


/**
 * It takes in a command name, a description, and a permissions level, and then adds a command to the
 * chat controller
 * @param {string | Array<string>} commandName - The name or names of commands to register under one function
 * @param {string} description - The description of the command
 * @param {PERMISSIONS} permissions - PERMISSIONS
 * @returns A function that takes in 3 parameters.
 */
export function command(commandName: string | string[], description: string, permissions: PERMISSIONS) {
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

/**
 * Registers a console command
 *
 * @export
 * @param {string} commandName
 * @return {*}
 */
export function consoleCommand(commandName: string) {
    return (_target: Function, _propertyKey: string, descriptor: PropertyDescriptor) => {
        ConsoleCommander.registerConsoleCommand(commandName, descriptor.value);
    };
}
