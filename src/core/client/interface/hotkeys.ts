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
     *
     */
    isAiming?: boolean;

    /**
     * Player must be swimming to be able to trigger this key bind.
     *
     * @type {boolean}
     *
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
     *
     */
    weaponModels?: Array<number>;
}

export interface KeyInfo extends BaseKeyInfo {
    /**
     * Call this function when the key is pressed down once.
     *
     * @type {Function}
     *
     */
    keyDown?: Function;

    /**
     * Only triggered when `msToTrigger` is also specified for this key bind.
     *
     * @type {Function}
     *
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
         *
         */
        msToTrigger?: number;
    };

    /**
     * Call this function when the key is let go.
     * This function is only called when a key is released.
     *
     * @type {Function}
     *
     */
    keyUp?: Function;

    /**
     * Call this function on repeat while this key is held down.
     * Equivalent to an everyTick.
     *
     * @type {Function}
     *
     */
    whilePressed?: Function;

    /**
     * Set a key as disabled, preventing all function callbacks.
     *
     * @type {boolean}
     *
     */
    disabled?: boolean;
}

export interface BaseKeyInfo {
    /**
     * The primary key for this keybind.
     *
     * @type {number}
     *
     */
    key: number;

    /**
     * Describe what this keybind is meant to do.
     *
     * @type {string}
     *
     */
    description: string;

    /**
     * Give a keybind an identifier, like a unique id.
     *
     * @type {string}
     *
     */
    identifier: string;

    /**
     * Only triggered when `msToTrigger` is also specified for this key bind.
     *
     * @type {Function}
     *
     */
    delayedKeyDown?: {
        /**
         * Milliseconds needed to trigger this keybind.
         * Used for triggering if the key is held long enough.
         * The trigger is fired instantly after the time point is exceeded.
         *
         * @type {number}
         *
         */
        msToTrigger?: number;
    };

    /**
     * Call this function when the key is let go.
     * This function is only called when a key is released.
     *
     * @type {Function}
     *
     */
    keyUp?: Function;

    /**
     * Call this function on repeat while this key is held down.
     * Equivalent to an everyTick.
     *
     * @type {Function}
     *
     */
    whilePressed?: Function;

    /**
     * Specify a modifier for this key to trigger
     *
     * @type {('shift' | 'ctrl' | 'alt')}
     *
     */
    modifier?: 'shift' | 'ctrl' | 'alt';

    /**
     * If set to true, any page / menu will allow triggering this keybind.
     *
     * @type {boolean}
     *
     */
    allowInAnyMenu?: true;

    /**
     * Allow using the keybind even if the player is dead.
     *
     * @type {true}
     * @memberof BaseKeyInfo
     */
    allowIfDead?: true;

    /**
     * Allows the keybind to be ignore menu checks if in a specific page.
     *
     * @type {string}
     *
     */
    allowInSpecificPage?: string;

    /**
     * The amount of milliseconds before this hotkey can be pressed again.
     *
     * @type {number}
     *
     */
    spamPreventionInMs?: number;

    /**
     * Restrictions to apply to this key bind.
     * These are all optional. By default key binds work regardless of setting these values.
     */
    restrictions?: KeyBindRestrictions;

    /**
     * Prevent his key from being rebound?
     *
     * @type {boolean}
     *
     */
    doNotAllowRebind?: boolean;
}
