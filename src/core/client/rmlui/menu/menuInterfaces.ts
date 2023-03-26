import * as alt from 'alt-client';

interface MenuOptionBase<T = Function> {
    /**
     * The title of this menu option.
     *
     * @type {string}
     *
     */
    title: string;

    /**
     * A description of this menu option.
     *
     * @type {string}
     *
     */
    description: string;

    /**
     * A callback when this menu option is changed.
     *
     * @type {T | Function}
     *
     */
    callback: T | Function;

    /**
     * Only for Range & Selection Types
     *
     * @type {boolean}
     *
     */
    onlyUpdateOnEnter?: boolean;
}

export interface Selection extends MenuOptionBase<(value: string) => void> {
    type: 'Selection';

    /**
     * The available values for this option.
     *
     * @type {Array<string>}
     *
     */
    options: Array<string>;

    /**
     * Current index of this selection.
     *
     * @type {number}
     *
     */
    value: number;

    /**
     * Only update when 'Enter' is pressed.
     *
     * @type {boolean}
     *
     */
    onlyUpdateOnEnter?: boolean;
}

export interface Toggle extends MenuOptionBase<(value: boolean) => void> {
    type: 'Toggle';

    /**
     * The default value for this menu.
     *
     * @type {boolean}
     *
     */
    value: boolean;
}

export interface Range extends MenuOptionBase<(value: number) => void> {
    type: 'Range';

    /**
     * The starting value of the range.
     *
     * @type {number}
     *
     */
    value: number;

    /**
     * Minimum Value
     *
     * @type {number}
     *
     */
    min: number;

    /**
     * Maximum Value
     *
     * @type {number}
     *
     */
    max: number;

    /**
     * Number to increment by
     *
     * @type {number}
     *
     */
    increment: number;

    /**
     * Only update when 'Enter' is pressed.
     *
     * @type {boolean}
     *
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
     *
     */
    options: Array<Selection | Range | Toggle | Invoke>;
}
