// Extends the player interface.
declare module 'alt-server' {
    export interface Player {
        /**
         * Check if a player is cuffed or not.
         * Instance based and non-persistent data between sessions.
         * @type {number}
         * @memberof Player
         */
        isCuffed?: boolean;

        /**
         * Check if a player is cuffed but can move freely.
         *
         * @type {boolean}
         * @memberof Player
         */
        isCuffedFreeMoving?: boolean;
    }
}
