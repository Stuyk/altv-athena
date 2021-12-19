import * as alt from 'alt-server';

// Extends the player interface.
declare module 'alt-server' {
    export interface Player {
        /**
         *
         * @type {(null | undefined | string)}
         * @memberof Player
         */
        interior?: null | undefined | string;
    }
}
