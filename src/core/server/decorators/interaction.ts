import alt from 'alt-server';
import { Interaction } from '../../shared/interfaces/interaction';
import { Athena } from '../api/athena';

/**
 * Decorator for Athena's Interaction Controller
 * ```
 * class ExampleDecoratorInteraction {
 *      @interaction({ 
 *          position: { x: 0, y: 0, z: 71 }, 
 *          description: 'Hello World!', 
 *          range: 25, 
 *          dimension: 0, 
 *          uid: 'UUID', 
 *          debug: false, 
 *          isPlayerOnly: false, 
 *          isVehicleOnly: false 
 *      })
 *      static doSomething() {
 *          alt.logError("Hello World");
 *      }
 *}
 * ```
 * @param {IVector3} data.position - The position of the interaction.
 * @param {string} data.description - The description of the interaction.
 * @param {number} data.range - The range of the interaction.
 * @param {number} data.dimension - The dimension to search in.
 * @param {string} data.uid - The uid of the interaction.
 * @param {boolean} data.debug - If the interaction should be debugged.
 * @param {boolean} data.playerOnly - If the interaction should only be triggered by players.
 * @param {boolean} data.vehicleOnly - If the interaction should only be triggered by vehicles.
 */
export function interaction(data: Interaction) {
    return (_target: Function, _propertyName: string, descriptor: PropertyDescriptor) => {
        Athena.controllers.interaction.add({ ...data, callback: descriptor.value });
    };
}