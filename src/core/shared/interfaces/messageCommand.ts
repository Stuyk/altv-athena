export type CommandCallback<T> = (player: T, ...args: any[]) => void;

export interface MessageCommand<T> {
    /**
     * The plain text iteration of this command.
     *
     * @type {string}
     * @memberof MessageCommand
     */
    name: string;

    /**
     * A description of this command.
     *
     * @type {string}
     * @memberof MessageCommand
     */
    description: string;

    /**
     * An array of individual permission strings required to run this command.
     *
     * @type {Array<string>}
     * @memberof MessageCommand
     */
    permissions: Array<string>;

    /**
     * Should this command use character permissions instead of account?
     *
     * @type {boolean}
     * @memberof MessageCommand
     */
    isCharacterPermission?: boolean;

    /**
     * The function to call when this command is executed by a player, or internal function.
     *
     * @memberof MessageCommand
     */
    callback: CommandCallback<T>;
}
