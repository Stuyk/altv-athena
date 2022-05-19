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
}

export interface IWheelOptionExt extends IWheelOption {
    callback?: (...args: any[]) => void;
    emitServer?: string;
    emitClient?: string;
    data?: Array<any>;
}
