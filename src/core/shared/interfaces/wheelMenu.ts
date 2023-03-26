/**
 * Used to describe a wheel menu option.
 *
 *
 * @interface IWheelOption
 */
export interface IWheelOption {
    /**
     * The name of this option.
     *
     * @type {string}
     *
     */
    name: string;
    /**
     * A unique identifier for this option.
     *
     * If not specified one will automatically be created.
     *
     * @type {string}
     *
     */
    uid?: string;

    /**
     * A plain text color for the icon and text color.
     *
     * ie. `red`, `green`, `yellow`, etc.
     *
     * @type {string}
     *
     */
    color?: string;

    /**
     * An icon from the `icons` page in the pages.
     *
     * ie. `icon-home`
     *
     * @type {string}
     *
     */
    icon?: string;

    /**
     * Do not close the wheel menu after executing this option.
     *
     * @type {boolean}
     *
     */
    doNotClose?: boolean;

    /**
     * From the client, call a specific server event through alt.emitServer
     *
     * @type {string}
     *
     */
    emitServer?: string;

    /**
     * From the client, emit a client event through alt.emit
     *
     * @type {string}
     *
     */
    emitClient?: string;

    /**
     * Any data that you want to pass through a callback or an event.
     *
     * @type {Array<any>}
     *
     */
    data?: Array<any>;

    /**
     * Image based on asset path.
     * Example: '/assets/icons/bullpuprifle.png'
     *
     * @type {string}
     *
     */
    image?: string;

    /**
     * Image based on asset path.
     * Example: '/assets/icons/bullpuprifle.png'
     *
     * @type {string}
     *
     */
    bgImage?: string;
}

export interface IWheelOptionExt extends IWheelOption {
    /**
     * A callback that will only work on client-side.
     *
     *
     */
    callback?: (...args: any[]) => void;
}
