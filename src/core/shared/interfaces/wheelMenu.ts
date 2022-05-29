export interface IWheelOption {
    /**
     * The name of this option.
     *
     * @type {string}
     * @memberof IWheelOption
     */
    name: string;
    /**
     * A unique identifier for this option.
     *
     * If not specified one will automatically be created.
     *
     * @type {string}
     * @memberof IWheelOption
     */
    uid?: string;

    /**
     * A plain text color for the icon and text color.
     *
     * ie. `red`, `green`, `yellow`, etc.
     *
     * @type {string}
     * @memberof IWheelOption
     */
    color?: string;

    /**
     * An icon from the `icons` page in the pages.
     *
     * ie. `icon-home`
     *
     * @type {string}
     * @memberof IWheelOption
     */
    icon?: string;

    /**
     * Do not close the wheel menu after executing this option.
     *
     * @type {boolean}
     * @memberof IWheelOption
     */
    doNotClose?: boolean;

    /**
     * From the client, call a specific server event through alt.emitServer
     *
     * @type {string}
     * @memberof IWheelOption
     */
    emitServer?: string;

    /**
     * From the client, emit a client event through alt.emit
     *
     * @type {string}
     * @memberof IWheelOption
     */
    emitClient?: string;

    /**
     * Any data that you want to pass through a callback or an event.
     *
     * @type {Array<any>}
     * @memberof IWheelOptionExt
     */
    data?: Array<any>;

    /**
     * Image based on asset path.
     * Example: '/assets/icons/bullpuprifle.png'
     *
     * @type {string}
     * @memberof IWheelOption
     */
    image?: string;

    /**
     * Image based on asset path.
     * Example: '/assets/icons/bullpuprifle.png'
     *
     * @type {string}
     * @memberof IWheelOption
     */
    bgImage?: string;
}

export interface IWheelOptionExt extends IWheelOption {
    /**
     * A callback that will only work on client-side.
     *
     * @memberof IWheelOptionExt
     */
    callback?: (...args: any[]) => void;
}
