import * as alt from 'alt-server';
import { Vector3 } from '../../shared/interfaces/vector';

/**
 * By default Interactions are supported for vehicle and player.
 * @export
 * @interface Interaction
 */
export interface Interaction {
    /**
     * A unique identifier for the Interaction
     */
    uid?: string;

    /**
     * Description of what the Interaction does
     * @type {string}
     * @memberof Interaction
     */
    description?: string;

    /**
     * The position in the 3D space of where this interaction should be.
     * Remember to subtract `1` from the z axis if you're using player coordinates.
     *
     * @type {Vector3}
     * @memberof Interaction
     */
    position: Vector3;

    /**
     * The max distance in which this interaction can be interacted with.
     * @type {number}
     * @memberof Interaction
     */
    range?: number;

    /**
     * What dimension this player must be in to use this colshape.
     * @type {number}
     * @memberof Interaction
     */
    dimension?: number;

    /**
     * What function to call back after the player has interacted with the Interaction Point
     * @memberof Interaction
     */
    callback?: (player: alt.Player, ...args: any[]) => void;

    /**
     * Forces the callback to immediately trigger without actually interacting.
     *
     * @type {boolean}
     * @memberof Interaction
     */
    triggerCallbackOnEnter?: boolean;

    /**
     * Called when a player has left an interaction point.
     *
     * @memberof Interaction
     */
    onLeaveCallback?: (player: alt.Player, ...args: any[]) => void;

    /**
     * Data to pass back through the callback.
     * Serves as a way to pass unique data through the callback.
     * @type {Array<any>}
     * @memberof Interaction
     */
    data?: Array<any>;

    /**
     * Should this interaction only work if the player is in a vehicle?
     * @type {boolean}
     * @memberof Interaction
     */
    isVehicleOnly?: boolean;

    /**
     * Should this interaction only work if the player is on foot?
     * @type {boolean}
     * @memberof Interaction
     */
    isPlayerOnly?: boolean;

    /**
     * Overrides the height for the interaction.
     *
     * @type {number}
     * @memberof Interaction
     */
    height?: number;

    /**
     * If set to true debug information will be sent to console.
     * @type {boolean}
     * @memberof Interaction
     */
    debug?: boolean;
}
