/**
 * Used to pass action information from server-side to client-side.
 *
 *
 * @interface Action
 */
export interface Action {
    /**
     * Name of the event to call.
     * @type {string}
     *
     */
    eventName: string;

    /**
     * Is a server event?
     * @type {boolean}
     *
     */
    isServer?: boolean;

    /**
     * Data to add to the menu to retrieve on option select.
     * @type {*}
     *
     */
    data?: any;
}

/**
 * An infinitely scaling menu.
 * Holds up to 9 options at a time
 *
 * @interface ActionMenu
 */
export interface ActionMenu {
    [key: string]: Action | ActionMenu;
}
