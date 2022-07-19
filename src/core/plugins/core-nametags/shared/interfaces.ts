export interface INametagConfig {
    /**
     * How far can a player walk away before name is not rendered.
     * @type {number}
     * @memberof INametagConfig
     */
    MAX_DRAW_DISTANCE: number;

    /**
     * Should the screen shake while shooting.
     * Useful against native aimbot hackers.
     * @type {boolean}
     * @memberof INametagConfig
     */
    SHOULD_SCREEN_SHAKE: boolean;

    /**
     * Show the name of the player?
     * @type {boolean}
     * @memberof INametagConfig
     */
    SHOW_NAME: boolean;

    /**
     * Show the id from the Identifier strategy.
     * @type {boolean}
     * @memberof INametagConfig
     */
    SHOW_ID: boolean;

    /**
     * If show name is enabled. Should the name instantly show?
     * Otherwise, there's around a 7 second delay before names show.
     * @type {boolean}
     * @memberof INametagConfig
     */
    SHOW_NAME_INSTANTLY: boolean;

    /**
     * Requires the user to hold left-alt to show nametags and ids.
     * Otherwise, nametags are always shown.
     * @type {boolean}
     * @memberof INametagConfig
     */
    SHOW_NAMETAGS_WITH_KEY: boolean;

    /**
     * Javascript Key Code for the key to use to show / hide.
     *
     * @type {number}
     * @memberof INametagConfig
     */
    NAME_TAGS_KEY: number;
}
