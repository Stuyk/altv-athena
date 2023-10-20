import * as alt from 'alt-server';
import { DiscordUser } from '../interface/iDiscordUser.js';
import IAttachable from '../../shared/interfaces/iAttachable.js';

declare module 'alt-server' {
    export interface Player {
        /**
         * A boolean for when a player is currently pending login.
         * @type {boolean}
         *
         */
        pendingLogin?: boolean;

        /**
         * Use dto get the Discord Token associated with a player.
         * @type {string}
         *
         */
        discordToken?: string;

        /**
         * Does the character currently have a model assigned to them?
         * @type {boolean}
         *
         */
        hasModel?: boolean;

        /**
         * Relevant Discord Infomation from Login
         * @type {DiscordUser}
         *
         */
        discord?: DiscordUser;

        /**
         * The next time the player is due for a 'ping'.
         * Ping being updating the character synchronization / information.
         * @type {number}
         *
         */
        nextPingTime: number;

        /**
         * The next play time update.
         * @type {number}
         *
         */
        nextPlayTime: number;

        /**
         * The current waypoint position on the player's map.
         * @type {(alt.IVector3 | null)}
         *
         */
        currentWaypoint: alt.IVector3 | null;

        /**
         * An array of attachables. Is not automatically initialized.
         * @type {(Array<IAttachable> | null)}
         *
         */
        attachables?: Array<IAttachable> | null;
    }
}
