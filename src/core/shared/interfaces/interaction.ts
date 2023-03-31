import * as alt from 'alt-server';

/**
 * By default Interactions are supported for vehicle and player.
 *
 * This interface is used to pass interaction information form server to client.
 *
 *
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
     *
     */
    description?: string;

    /**
     * The position in the 3D space of where this interaction should be.
     * Remember to subtract `1` from the z axis if you're using player coordinates.
     *
     * @type {alt.IVector3}
     *
     */
    position: alt.IVector3;

    /**
     * The max distance in which this interaction can be interacted with.
     * @type {number}
     *
     */
    range?: number;

    /**
     * What dimension this player must be in to use this colshape.
     * @type {number}
     *
     */
    dimension?: number;

    /**
     * What function to call back after the player has interacted with the Interaction Point
     *
     */
    callback?: (player: alt.Player, ...args: any[]) => void;

    /**
     * Forces the callback to immediately trigger without actually interacting.
     *
     * @type {boolean}
     *
     */
    triggerCallbackOnEnter?: boolean;

    /**
     * Called when a player has left an interaction point.
     *
     *
     */
    onLeaveCallback?: (player: alt.Player, ...args: any[]) => void;

    /**
     * Data to pass back through the callback.
     * Serves as a way to pass unique data through the callback.
     * @type {Array<any>}
     *
     */
    data?: Array<any>;

    /**
     * Should this interaction only work if the player is in a vehicle?
     * @type {boolean}
     *
     */
    isVehicleOnly?: boolean;

    /**
     * Should this interaction only work if the player is on foot?
     * @type {boolean}
     *
     */
    isPlayerOnly?: boolean;

    /**
     * Overrides the height for the interaction.
     *
     * @type {number}
     *
     */
    height?: number;

    /**
     * If set to true debug information will be sent to console.
     * @type {boolean}
     *
     */
    debug?: boolean;
}
