import { PERMISSIONS, CHARACTER_PERMISSIONS } from '../flags/permissionFlags';

export interface Command {
    /**
     * The name of the command being created.
     * @type {string}
     * @memberof Command
     */
    name: string;

    /**
     * The description of the command.
     * You should always append the command itself here.
     * ie. '/tpto [target_id]'
     * @type {string}
     * @memberof Command
     */
    description: string;

    /**
     * A Bitwise Enum of accounts who can access this command.
     * Can be combined to allow multiple ranks / permissions.
     * ie. 'PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR'
     *
     * Set to NONE for everyone to access it.
     * @type {PERMISSIONS}
     * @memberof Command
     */
    permission?: PERMISSIONS;

    /**
     * A Bitwise Enum of characters who can access this command.
     * Can be combined to allow multiple ranks / permissions.
     * ie. 'CHARACTER_PERMISSIONS.COP | CHARACTER_PERMISSIONS.MEDIC'
     *
     * The above examples are not implemented. You must implement them yourself.
     * Set to NONE for everyone to access it.
     * @type {CHARACTER_PERMISSIONS}
     * @memberof Command
     */
    characterPermissions?: CHARACTER_PERMISSIONS;

    /**
     * The callback function to call after executing this command.
     * First argument back is always 'alt.Player'.
     * @type {Function}
     * @memberof Command
     */
    func?: Function;
}
