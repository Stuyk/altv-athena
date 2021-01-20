import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { DiscordUser } from '../interface/DiscordUser';
import { Account } from '../interface/Account';

import * as currency from './playerPrototypes/currency';
import * as dataUpdater from './playerPrototypes/dataUpdater';
import * as emit from './playerPrototypes/emit';
import * as inventory from './playerPrototypes/inventory';
import * as newProto from './playerPrototypes/new';
import * as safe from './playerPrototypes/safe';
import * as save from './playerPrototypes/save';
import * as select from './playerPrototypes/select';
import * as set from './playerPrototypes/set';
import * as sync from './playerPrototypes/sync';

declare module 'alt-server' {
    export interface Player {
        // First Join Data
        pendingLogin?: boolean; // Used when a player is pending login.
        discordToken?: string; // Used to assist with loggin in a player through oAuth2.
        needsQT?: boolean;
        hasModel?: boolean;
        currentCharacters: Array<Character>;
        pendingCharacterEdit?: boolean;
        pendingNewCharacter?: boolean;
        pendingCharacterSelect?: boolean;

        // Player Data
        accountData?: Partial<Account>; // Account Identifiers for Discord
        discord?: DiscordUser; // Discord Information
        data?: Partial<Character>; // Currently Selected Character

        // Anti
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;

        // Status Effects
        nextDeathSpawn: number;
        nextPingTime: number;

        // World Data
        gridSpace: number;
        currentWeather: string;

        /**
         * Currency related functions.
         * @type {currency.CurrencyPrototype}
         * @memberof Player
         */
        currency(): currency.CurrencyPrototype;

        /**
         * Used to update bulk player data.
         * Or initialize existing or current data.
         * @type {dataUpdater.DataUpdaterPrototype}
         * @memberof Player
         */
        dataUpdater(): dataUpdater.DataUpdaterPrototype;

        /**
         * Interact directly with the client.
         * Animations, Sound, Events, Meta Data
         * @type {emit.EmitPrototype}
         * @memberof Player
         */
        emit(): emit.EmitPrototype;

        /**
         * Handles all inventory related functionality.
         * @return {*}  {inventory.InventoryPrototype}
         * @memberof Player
         */
        inventory(): inventory.InventoryPrototype;

        /**
         * New Character, Vehicle, etc. for this player.
         * @type {newProto.NewDataPrototype}
         * @memberof Player
         */
        newData(): newProto.NewDataPrototype;

        /**
         * Used for future anti-cheat capabilities.
         * @type {safe.ISafePrototype}
         * @memberof Player
         */
        safe(): safe.SafePrototype;

        /**
         * Save Data to the Database
         * @type {save.SavePrototype}
         * @memberof Player
         */
        save(): save.SavePrototype;

        /**
         * Select Character, Vehicle, etc.
         * @type {select.SelectPrototype}
         * @memberof Player
         */
        select(): select.SelectPrototype;

        /**
         * Set specific data on this player.
         * @type {set.SetPrototype}
         * @memberof Player
         */
        set(): set.SetPrototype;

        /**
         * Synchronize state for the local player.
         * Appearance, data, bank, etc.
         * @type {sync.SyncPrototype}
         * @memberof Player
         */
        sync(): sync.SyncPrototype;

        invoke<T>(...args): any;
    }
}

alt.Player.prototype.currency = currency.bind;
alt.Player.prototype.dataUpdater = dataUpdater.bind;
alt.Player.prototype.emit = emit.bind;
alt.Player.prototype.inventory = inventory.bind;
alt.Player.prototype.newData = newProto.bind;
alt.Player.prototype.safe = safe.bind;
alt.Player.prototype.save = save.bind;
alt.Player.prototype.select = select.bind;
alt.Player.prototype.set = set.bind;
alt.Player.prototype.sync = sync.bind;
