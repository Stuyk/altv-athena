export const AdminControlEvents = {
    toServer: {
        invoke: 'admin:control:invoke:event',
    },
    toClient: {
        controls: 'admin:control:invoke:update',
    },
};

export interface AdminControl {
    /**
     * Exactly what this control should do as a name.
     *
     * Keep it short and simple.
     *
     * Example: `Delete Current Vehicle`, `Delete Vehicle by ID`, `Teleport to Player`
     *
     * @type {string}
     * @memberof BaseAdminControl
     */
    name: string;

    /**
     * The name of the component to correspond with this.
     *
     * Usually a vue component, or some other way to identify this control.
     *
     * @type {string}
     * @memberof BaseAdminControl
     */
    component: string;

    /**
     * A unique identifier to identify this control.
     *
     * @type {string}
     * @memberof BaseAdminControl
     */
    uid: string;

    /**
     * Keywords need to be single words, and simply suggestions that match what it does.
     *
     * ie: `['player', 'vehicle', 'delete', 'id']`
     *
     * @type {Array<string>}
     * @memberof BaseAdminControl
     */
    keywords: Array<string>;

    /**
     * Account permissions that have access to these controls.
     *
     * @type {Array<string>}
     * @memberof BaseAdminControl
     */
    permissions: Array<string>;
}
