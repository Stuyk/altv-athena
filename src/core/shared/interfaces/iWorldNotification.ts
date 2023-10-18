import { WORLD_NOTIFICATION_TYPE } from '../enums/worldNotificationTypes.js';
import * as alt from 'alt-shared';

/**
 * Used to pass an in-world marker from server to client.
 *
 *
 * @interface IWorldNotification
 */
export interface IWorldNotification {
    /**
     * Position of the Object in a 3D space.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * Text to display for this world notification.
     * @type {string}
     *
     */
    text: string;

    /**
     * The IWorldNotification Type Associated with this IWorldNotification
     * @type {number}
     *
     */
    type: WORLD_NOTIFICATION_TYPE | number;

    /**
     * The background color associated with this notification.
     * There are at least 30.
     * @type {number}
     *
     */
    background?: number;

    /**
     * The max distance to render this IWorldNotification.
     * @type {number}
     *
     */
    maxDistance?: number;

    /**
     * The unique identifier for this IWorldNotification.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * The dimension to display this IWorldNotification in.
     * @type {number}
     *
     */
    dimension?: number;
}
