import { DefineComponent } from 'vue';

export default interface IPageData {
    /**
     * The name of the component.
     * Used for client to webview toggling.
     * @type {string}
     * @memberof IPageData
     */
    name: string;

    /**
     * The component to bind to this object.
     * @type {DefineComponent}
     * @memberof IPageData
     */
    component: DefineComponent;
}
