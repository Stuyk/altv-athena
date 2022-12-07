export interface OptionFor3DMenu {
    /**
     * The name to display on-screen.
     *
     * @type {string}
     * @memberof OptionFor3DMenu
     */
    name: string;

    /**
     * What function to call when this item is selected.
     *
     * @memberof OptionFor3DMenu
     */
    callback: () => void;
}
