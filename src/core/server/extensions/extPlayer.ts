import * as alt from 'alt-server';
import { Account } from '../interface/iAccount';
import { DiscordUser } from '../interface/iDiscordUser';
import { InteractionShape } from './extColshape';
import currency from './playerFunctions/currency';
import dataUpdater from './playerFunctions/dataUpdater';
import emit from './playerFunctions/emit';
import inventory from './playerFunctions/inventory';
import createNew from './playerFunctions/new';
import safe from './playerFunctions/safe';
import save from './playerFunctions/save';
import select from './playerFunctions/select';
import set from './playerFunctions/setter';
import sync from './playerFunctions/sync';
import utility from './playerFunctions/utility';
import getter from './playerFunctions/getter';

import '../views/factions';
import '../systems/arrest';
import '../events/waypointEvent';
import { Vector3 } from '../../shared/interfaces/vector';
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
         * A temporary array assigned when the account fetches all characters.
         * @type {Array<Character>}
         * @memberof Player
         */
        currentCharacters?: Array<Character>;

        /**
         * Used to check if the character is pending editing.
         * @type {boolean}
         * @memberof Player
         */
        pendingCharacterEdit?: boolean;

        /**
         * Used to bring up / interact with new character screen.
         * @type {boolean}
         * @memberof Player
         */
        pendingNewCharacter?: boolean;

        /**
         * Used to bring up / interace with the select character screen.
         * @type {boolean}
         * @memberof Player
         */
        pendingCharacterSelect?: boolean;

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
        data?: Partial<Character>;

        // Unimplemented Anti-Cheat Stuff
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;

        /**
         * Next time the player can spawn after death.
         * @type {number}
         * @memberof Player
         */
        nextDeathSpawn: number;

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
         * Temporary index for selecting a character.
         * @type {number}
         * @memberof Player
         */
        selectedCharacterIndex?: number;

        /**
         * When the player is in-world and selected a character.
         * @type {boolean}
         * @memberof Player
         */
        hasFullySpawned?: boolean;
    }
}

export const playerFuncs = {
    currency,
    dataUpdater,
    emit,
    get: getter,
    inventory,
    createNew,
    safe,
    save,
    select,
    set,
    sync,
    utility,
};
