import * as alt from 'alt-server';
import { Account } from '../interface/iAccount';
import { DiscordUser } from '../interface/iDiscordUser';
import { InteractionShape } from './extColshape';
import { Vector3 } from '../../shared/interfaces/vector';
import IAttachable from '../../shared/interfaces/iAttachable';
import { playerConst } from '../api/consts/constPlayer';

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
         *
         * @type {boolean}
         * @memberof Player
         */
        needsQT?: boolean;

        /**
         * Does the character currently have a model assigned to them?
         * @type {boolean}
         * @memberof Player
         */
        hasModel?: boolean;

        /**
         * Account identifiers for Discord
         * @type {Partial<Account>}
         * @memberof Player
         */
        accountData?: Partial<Account>;

        /**
         * Relevant Discord Infomation from Login
         * @type {DiscordUser}
         * @memberof Player
         */
        discord?: DiscordUser;

        /**
         * The currently selected character bound to the player.
         * @type {Partial<Character>}
         * @memberof Player
         */
        data: Character;

        // Unimplemented Anti-Cheat Stuff
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;

        /**
         * The next time the player is due for a 'ping'.
         * Ping being updating the character synchronization / information.
         * @type {number}
         * @memberof Player
         */
        nextPingTime: number;

        /**
         * Used to update the items around the player.
         * @type {number}
         * @memberof Player
         */
        nextItemSync: number;

        /**
         * The next play time update.
         * @type {number}
         * @memberof Player
         */
        nextPlayTime: number;

        /**
         * The player's current wanted level.
         * @type {number}
         * @memberof Player
         */
        wanted: number;

        /**
         * Used to add / remove items from the toolbar.
         * This is the last item that was used on the toolbar.
         * @type {{ equipped: boolean; slot: number }}
         * @memberof Player
         */
        lastToolbarData: { equipped: boolean; slot: number };

        /**
         * Current grid space of where the player is.
         * It's more like an 'American Football Field' across the entire world.
         * Each grid space is a section of the map.
         * @type {number}
         * @memberof Player
         */
        gridSpace: number;

        /**
         * Current name of the weather in-use.
         * @type {string}
         * @memberof Player
         */
        currentWeather: string;

        /**
         * ID of the last vehicle the player has entered.
         * @type {number}
         * @memberof Player
         */
        lastEnteredVehicleID: number;

        /**
         * Used to check if the player is currently pushing a vehicle.
         * @type {boolean}
         * @memberof Player
         */
        isPushingVehicle: boolean;

        /**
         * The total number of vehicles the player has spawned.
         * @type {number}
         * @memberof Player
         */
        vehiclesSpawned: number;

        /**
         * The current waypoint position on the player's map.
         * @type {(Vector3 | null)}
         * @memberof Player
         */
        currentWaypoint: Vector3 | null;

        /**
         * The current interaction point the player is standing in.
         * @type {(InteractionShape | null)}
         * @memberof Player
         */
        currentInteraction: InteractionShape | null;

        /**
         * Last Faction ID for invite.
         * @type { alt.Player }
         * @memberof Player
         */
        lastFactionInvite: alt.Player;

        /**
         * An array of attachables. Is not automatically initialized.
         * @type {(Array<IAttachable> | null)}
         * @memberof Player
         */
        attachables?: Array<IAttachable> | null;

        /**
         * Used for vehicle seating.
         * Determines if the player has fully sat down.
         * @type {boolean}
         * @memberof Player
         */
        hasSatDown?: boolean;

        /**
         * When the player is in-world and selected a character.
         * @type {boolean}
         * @memberof Player
         */
        hasFullySpawned?: boolean;
    }
}

/**
 * The deprecated version of the Athena playerFuncs API.
 *
 * Use `Athena.player` instead.
 *
 * @deprecated Use the new {@link Athena} const.
 */
export const playerFuncs = playerConst;
