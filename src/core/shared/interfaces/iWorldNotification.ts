import { WORLD_NOTIFICATION_TYPE } from '../enums/worldNotificationTypes';
import { Vector3 } from './vector';

export interface IWorldNotification {
    /**
     * Position of the Object in a 3D space.
     * @type {Vector3}
     * @memberof IObject
     */
    pos: Vector3;

    /**
     * Text to display for this world notification.
     * @type {string}
     * @memberof IWorldNotification
     */
    text: string;

    /**
     * The IWorldNotification Type Associated with this IWorldNotification
     * @type {number}
     * @memberof IWorldNotification
     */
    type: WORLD_NOTIFICATION_TYPE | number;

    /**
     * The background color associated with this notification.
     * There are at least 30.
     * @type {number}
     * @memberof IWorldNotification
     */
    background?: number;

    /**
     * The max distance to render this IWorldNotification.
     * @type {number}
     * @memberof IWorldNotification
     */
    maxDistance?: number;

    /**
     * The unique identifier for this IWorldNotification.
     * @type {string}
     * @memberof IWorldNotification
     */
    uid?: string;

    /**
     * The dimension to display this IWorldNotification in.
     * @type {number}
     * @memberof IWorldNotification
     */
    dimension?: number;
}
