import { Vector3 } from './vector';

export interface TextLabel {
    /**
     * The position where to place the TextLabel in a 3D space.
     * @type {Vector3}
     * @memberof TextLabel
     */
    pos: Vector3;

    /**
     * The 'Text' to show on this text label.
     * @type {string}
     * @memberof TextLabel
     */
    data: string;

    /**
     * The maximum distance this text label should render at.
     * @type {number}
     * @memberof TextLabel
     */
    maxDistance?: number;

    /**
     * The unique identifier to remove this text label if necessary.
     * @type {string}
     * @memberof TextLabel
     */
    uid?: string;

    /**
     * The dimension to show this text label in.
     * @type {number}
     * @memberof TextLabel
     */
    dimension?: number;
}
