import { Athena } from '../../server/api/athena';
import { PERMISSIONS } from '../flags/permissionFlags';

export function command(commandName: string, description: string, permissions: PERMISSIONS) {
    return (_target: Function, _propertyKey: string, descriptor: PropertyDescriptor) => {
        Athena.controllers.chat.addCommand(commandName, description, permissions, descriptor.value);
    };
}
