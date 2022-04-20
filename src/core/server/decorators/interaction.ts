import alt, { IVector3 } from 'alt-server';
import { Athena } from '../api/athena';

/**
 * @param {IVector3} position - The position of the interaction.
 * @param {string} description - The description of the interaction.
 * @param {number} range - The range of the interaction.
 * @param {number} dimension - The dimension to search in.
 * @param {string} uid - The uid of the interaction.
 * Decorator for Athena's Interaction Controller
 * ```
 * class ExampleInteraction {
 *   @interaction({ x: 0, y: 0, z: 0 }, 'Hello World!', 25, 0, 'UUID')
 *   static exampleInteraction() {
 *      alt.log("Interaction controller got triggerd by player through decorator!");
 *   }
 * }
 * ```
 */

export function interaction(
    position: IVector3,
    description: string,
    range: number,
    dimension: number,
    uid: string,
    debug?: boolean,
    playerOnly?: boolean,
    vehicleOnly?: boolean,
) {
    return (_target: Function, _propertyName: string, descriptor: PropertyDescriptor) => {
        const callback: (player: alt.Player, ...args: any[]) => void = descriptor.value;
        Athena.controllers.interaction.add({
            position: position,
            description: description,
            dimension: dimension,
            isPlayerOnly: playerOnly,
            isVehicleOnly: vehicleOnly,
            range: range,
            debug: debug,
            uid: uid,
            callback: callback,
        });
    };
}
