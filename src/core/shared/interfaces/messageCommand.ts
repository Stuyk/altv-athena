export type CommandCallback<T> = (player: T, ...args: string[]) => void;

/**
 * Used to describe a command.
 *
 *
 * @interface MessageCommand
 * @template T
 */
export interface MessageCommand<T> {
    /**
     * The plain text iteration of this command.
     *
     * @type {string}
     *
     */
    name: string;

    /**
     * A description of this command.
     *
     * @type {string}
     *
     */
    description: string;

    /**
     * An array of individual permission strings required to run this command.
     *
     * @type {Array<string>}
     *
     */
    permissions: Array<string>;

    /**
     * Should this command use character permissions instead of account?
     *
     * @type {boolean}
     *
     */
    isCharacterPermission?: boolean;

    /**
     * The function to call when this command is executed by a player, or internal function.
     *
     *
     */
    callback: CommandCallback<T>;
}

export interface DetailedCommand extends Omit<MessageCommand<null>, 'callback'> {
    /**
     * An array of parameters that belong to this command
     *
     * @type {Array<string>}
     *
     */
    params: Array<string>;
}
