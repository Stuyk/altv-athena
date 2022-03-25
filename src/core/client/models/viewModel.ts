export default class ViewModel {
    /**
     * Called when the view is being opened and the url is being set.
     * @static
     * @type {Function}
     * @memberof ViewModel
     */
    static open: Function;

    /**
     * Called when the view is closed.
     * @static
     * @type {Function}
     * @memberof ViewModel
     */
    static close: Function;

    /**
     * Called when the view has loaded and it sends an event to this function.
     * @static
     * @type {Function}
     * @memberof ViewModel
     */
    static ready: Function;
}
