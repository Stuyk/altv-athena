import { DefineComponent } from 'vue';

export default interface IPageData {
    /**
     * The name of the component.
     * Used for client to webview toggling.
     * @type {string}
     *
     */
    name: string;

    /**
     * The component to bind to this object.
     * @type {DefineComponent}
     *
     */
    component: DefineComponent;
}
