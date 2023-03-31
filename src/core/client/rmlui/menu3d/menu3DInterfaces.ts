export interface OptionFor3DMenu {
    /**
     * The name to display on-screen.
     *
     * @type {string}
     *
     */
    name: string;

    /**
     * What function to call when this item is selected.
     *
     *
     */
    callback: () => void;
}
