export interface IRoleplayCmds {
    /**
     * Distance of the /ooc command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_OOC_DISTANCE: number;

    /**
     * Distance of the /me command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_ME_DISTANCE: number;

    /**
     * Distance of the /do command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_DO_DISTANCE: number;

    /**
     * Distance of the /low command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_LOW_DISTANCE: number;

    /**
     * Distance of the /w command
     * @type {number}
     * @memberof IRoleplayCmds
     */
    COMMAND_WHISPER_DISTANCE: number;

    /**
     * Hex color of Out of Character command
     * Must be HEX Color ie. `{e6e6ce}`
     * @type {string}
     * @memberof IRoleplayCmds
     */
    CHAT_ROLEPLAY_OOC_COLOR: string;

    /**
     * Hex color of /me, /do commands
     * Must be HEX Color ie. `{e6e6ce}`
     * @type {string}
     * @memberof IRoleplayCmds
     */
    CHAT_ROLEPLAY_COLOR: string;

    /**
     * Hex color of /low command
     * Must be HEX Color ie. `{e6e6ce}`
     * @type {string}
     * @memberof IRoleplayCmds
     */
    CHAT_ROLEPLAY_LOW_COLOR: string;

    /**
     * Hex color of /w command
     * Must be HEX Color ie. `{e6e6ce}`
     * @type {string}
     * @memberof IRoleplayCmds
     */
    CHAT_ROLEPLAY_WHISPER_COLOR: string;
}
