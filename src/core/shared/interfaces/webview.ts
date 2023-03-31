/**
 * Used to describe a webview page that can be overlayed.
 *
 *
 * @interface OverlayPageType
 */
export interface OverlayPageType {
    /**
     * The name of the page.
     *
     * @type {string}
     *
     */
    name: string;

    /**
     * Is this overlay hidden?
     *
     * @type {boolean}
     *
     */
    isHidden?: boolean;

    /**
     * Callback to re-toggle page visibility.
     *
     *
     */
    callback: (isVisible: boolean) => void;
}
