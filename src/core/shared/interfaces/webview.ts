/**
 * Used to describe a webview page that can be overlayed.
 *
 * @export
 * @interface OverlayPageType
 */
export interface OverlayPageType {
    /**
     * The name of the page.
     *
     * @type {string}
     * @memberof PageType
     */
    name: string;

    /**
     * Is this overlay hidden?
     *
     * @type {boolean}
     * @memberof OverlayPageType
     */
    isHidden?: boolean;

    /**
     * Callback to re-toggle page visibility.
     *
     * @memberof OverlayPageType
     */
    callback: (isVisible: boolean) => void;
}
