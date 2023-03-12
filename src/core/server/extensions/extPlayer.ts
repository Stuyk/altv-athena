import * as alt from 'alt-server';
import { DiscordUser } from '../interface/iDiscordUser';
import IAttachable from '../../shared/interfaces/iAttachable';

declare module 'alt-server' {
    export interface Player {
        /**
         * A boolean for when a player is currently pending login.
         * @type {boolean}
         * @memberof Player
         */
        pendingLogin?: boolean;

        /**
         * Use dto get the Discord Token associated with a player.
         * @type {string}
         * @memberof Player
         */
        discordToken?: string;

        /**
         * Does the character currently have a model assigned to them?
         * @type {boolean}
         * @memberof Player
         */
        hasModel?: boolean;

        /**
         * Relevant Discord Infomation from Login
         * @type {DiscordUser}
         * @memberof Player
         */
        discord?: DiscordUser;

        /**
         * The next time the player is due for a 'ping'.
         * Ping being updating the character synchronization / information.
         * @type {number}
         * @memberof Player
         */
        nextPingTime: number;

        /**
         * The next play time update.
         * @type {number}
         * @memberof Player
         */
        nextPlayTime: number;

        /**
         * The current waypoint position on the player's map.
         * @type {(alt.IVector3 | null)}
         * @memberof Player
         */
        currentWaypoint: alt.IVector3 | null;

        /**
         * An array of attachables. Is not automatically initialized.
         * @type {(Array<IAttachable> | null)}
         * @memberof Player
         */
        attachables?: Array<IAttachable> | null;

        /**
         * When the player is in-world and selected a character.
         * @type {boolean}
         * @memberof Player
         */
        hasFullySpawned?: boolean;
    }
}
