export interface Action {
    /**
     * Name of the event to call.
     * @type {string}
     * @memberof Action
     */
    eventName: string;

    /**
     * Is a server event?
     * @type {boolean}
     * @memberof Action
     */
    isServer?: boolean;

    /**
     * Data to add to the menu to retrieve on option select.
     * @type {*}
     * @memberof Action
     */
    data?: any;
}

/**
 * An infinitely scaling menu.
 * Holds up to 9 options at a time
 * @export
 * @interface ActionMenu
 */
export interface ActionMenu {
    [key: string]: Action | ActionMenu;
}
