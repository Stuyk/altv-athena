import * as alt from 'alt-client';

interface MenuOptionBase<T = Function> {
    /**
     * The title of this menu option.
     *
     * @type {string}
     * @memberof MenuOptionBase
     */
    title: string;

    /**
     * A description of this menu option.
     *
     * @type {string}
     * @memberof MenuOptionBase
     */
    description: string;

    /**
     * A callback when this menu option is changed.
     *
     * @type {T | Function}
     * @memberof MenuOptionBase
     */
    callback: T | Function;

    /**
     * Only for Range & Selection Types
     *
     * @type {boolean}
     * @memberof MenuOptionBase
     */
    onlyUpdateOnEnter?: boolean;
}

export interface Selection extends MenuOptionBase<(value: string) => void> {
    type: 'Selection';

    /**
     * The available values for this option.
     *
     * @type {Array<string>}
     * @memberof Selection
     */
    options: Array<string>;

    /**
     * Current index of this selection.
     *
     * @type {number}
     * @memberof Selection
     */
    value: number;

    /**
     * Only update when 'Enter' is pressed.
     *
     * @type {boolean}
     * @memberof Selection
     */
    onlyUpdateOnEnter?: boolean;
}

export interface Toggle extends MenuOptionBase<(value: boolean) => void> {
    type: 'Toggle';

    /**
     * The default value for this menu.
     *
     * @type {boolean}
     * @memberof Toggle
     */
    value: boolean;
}

export interface Range extends MenuOptionBase<(value: number) => void> {
    type: 'Range';

    /**
     * The starting value of the range.
     *
     * @type {number}
     * @memberof Range
     */
    value: number;

    /**
     * Minimum Value
     *
     * @type {number}
     * @memberof Range
     */
    min: number;

    /**
     * Maximum Value
     *
     * @type {number}
     * @memberof Range
     */
    max: number;

    /**
     * Number to increment by
     *
     * @type {number}
     * @memberof Range
     */
    increment: number;

    /**
     * Only update when 'Enter' is pressed.
     *
     * @type {boolean}
     * @memberof Selection
     */
    onlyUpdateOnEnter?: boolean;
}

export interface Invoke extends MenuOptionBase<() => void> {
    type: 'Invoke';
}

export interface MenuInfo {
    header: {
        /**
         * The title of this menu.
         *
         * @type {string}
         */
        title: string;

        /**
         * The banner background color of this menu.
         *
         * @type {alt.RGBA}
         */
        color: alt.RGBA | string;
    };

    /**
     * An array of available menu types to invoke.
     *
     * @type {(Array<Selection | Invoke | Range | Toggle>)}
     * @memberof MenuInfo
     */
    options: Array<Selection | Range | Toggle | Invoke>;
}
