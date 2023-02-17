export interface KeyBindRestrictions {
    /**
     * Player must be out of a vehicle to use this key bind.
     *
     * @type {boolean}
     */
    isOnFoot?: boolean;

    /**
     * Player must be in any vehicle to use this key bind.
     * Accessible by anyone in the vehicle.
     *
     * @type {boolean}
     */
    isVehicle?: boolean;

    /**
     * Player must be in a vehicle as a passenger. Not the driver.
     *
     * @type {boolean}
     */
    isVehiclePassenger?: boolean;

    /**
     * Player must be the driver of the vehicle.
     *
     * @type {boolean}
     */
    isVehicleDriver?: boolean;

    /**
     * Player must be aiming a weapon of some sort to trigger this key bind.
     *
     * @type {boolean}
     * @memberof KeyBindRestrictions
     */
    isAiming?: boolean;

    /**
     * Player must be swimming to be able to trigger this key bind.
     *
     * @type {boolean}
     * @memberof KeyBindRestrictions
     */
    isSwimming?: boolean;

    /**
     * Create an array of vehicle model hashes that this key bind only works under.
     * Example: `[alt.hash('infernus'), alt.hash('police2')]`
     *
     * @type {(Array<number>)}
     */
    vehicleModels?: Array<number>;

    /**
     * Create an array of weapon model hashes that this key bind only works under.
     * Example: `[alt.hash('w_ar_advancedrifle')]`
     *
     * @type {Array<number>}
     * @memberof KeyBindRestrictions
     */
    weaponModels?: Array<number>;
}

export interface KeyInfo extends BaseKeyInfo {
    /**
     * Call this function when the key is pressed down once.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    keyDown?: Function;

    /**
     * Only triggered when `msToTrigger` is also specified for this key bind.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    delayedKeyDown?: {
        /**
         * Function to call after the criteria is met.
         *
         * @type {Function}
         */
        callback: Function;

        /**
         * Milliseconds needed to trigger this keybind.
         * Used for triggering if the key is held long enough.
         * The trigger is fired instantly after the time point is exceeded.
         *
         * @type {number}
         * @memberof KeyInfo
         */
        msToTrigger?: number;
    };

    /**
     * Call this function when the key is let go.
     * This function is only called when a key is released.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    keyUp?: Function;

    /**
     * Call this function on repeat while this key is held down.
     * Equivalent to an everyTick.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    whilePressed?: Function;

    /**
     * Set a key as disabled, preventing all function callbacks.
     *
     * @type {boolean}
     * @memberof KeyInfo
     */
    disabled?: boolean;
}

export interface BaseKeyInfo {
    /**
     * The primary key for this keybind.
     *
     * @type {number}
     * @memberof KeyInfo
     */
    key: number;

    /**
     * Describe what this keybind is meant to do.
     *
     * @type {string}
     * @memberof KeyInfo
     */
    description: string;

    /**
     * Give a keybind an identifier, like a unique id.
     *
     * @type {string}
     * @memberof KeyInfo
     */
    identifier: string;

    /**
     * Only triggered when `msToTrigger` is also specified for this key bind.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    delayedKeyDown?: {
        /**
         * Milliseconds needed to trigger this keybind.
         * Used for triggering if the key is held long enough.
         * The trigger is fired instantly after the time point is exceeded.
         *
         * @type {number}
         * @memberof KeyInfo
         */
        msToTrigger?: number;
    };

    /**
     * Call this function when the key is let go.
     * This function is only called when a key is released.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    keyUp?: Function;

    /**
     * Call this function on repeat while this key is held down.
     * Equivalent to an everyTick.
     *
     * @type {Function}
     * @memberof KeyInfo
     */
    whilePressed?: Function;

    /**
     * Specify a modifier for this key to trigger
     *
     * @type {('shift' | 'ctrl' | 'alt')}
     * @memberof KeyInfo
     */
    modifier?: 'shift' | 'ctrl' | 'alt';

    /**
     * If set to true, any page / menu will allow triggering this keybind.
     *
     * @type {boolean}
     * @memberof KeyInfo
     */
    allowInAnyMenu?: true;

    /**
     * Allows the keybind to be ignore menu checks if in a specific page.
     *
     * @type {string}
     * @memberof BaseKeyInfo
     */
    allowInSpecificPage?: string;

    /**
     * Restrictions to apply to this key bind.
     * These are all optional. By default key binds work regardless of setting these values.
     */
    restrictions?: KeyBindRestrictions;
}
