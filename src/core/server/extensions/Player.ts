import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { DiscordUser } from '../interface/DiscordUser';
import { Account } from '../interface/Account';

import * as currency from './playerPrototypes/currency';
import * as dataUpdater from './playerPrototypes/dataUpdater';
import * as emit from './playerPrototypes/emit';
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
         * Set various properties.
         * Frozen,
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
alt.Player.prototype.newData = newProto.bind;
alt.Player.prototype.safe = safe.bind;
alt.Player.prototype.save = save.bind;
alt.Player.prototype.select = select.bind;
alt.Player.prototype.set = set.bind;
alt.Player.prototype.sync = sync.bind;

// alt.Player.prototype.safe = function () {
//     const _this = this;
//     _this.addArmour = safe.addArmour;
//     _this.addHealth = safe.addHealth;
//     _this.setPosition = safe.setPosition;
//     return _this;
// } as any;

// Object.assign(alt.Player.prototype.safe, {});
// Object.assign(alt.Player.prototype.safe.addArmour, safe.addArmour);
// Object.assign(alt.Player.prototype.safe.addArmour, safe.addArmour);
// Object.assign(alt.Player.prototype.safe.addArmour, safe.addArmour);

// alt.Player.prototype.safe.addArmour = safe.addArmour;
// alt.Player.prototype.safe.addHealth = safe.addHealth;
// alt.Player.prototype.safe.setPosition = safe.setPosition;

// .addArmour = safe.default.addArmour;
// alt.Player.prototype.safe.addHealth = safe.default.addHealth;
// alt.Player.prototype.safe.setPosition = safe.default.setPosition;

// alt.Player.prototype.safe = {
//     addArmour: safe.SafePrototype.addArmour,
//     addHealth: safe.SafePrototype.addHealth,
//     setPosition: safe.SafePrototype.setPosition
// } as safe.ISafePrototype;

// // Emit Extensions
// alt.Player.prototype.currency = CurrencyPrototype.getInstance(alt.Player.prototype);
// alt.Player.prototype.dataUpdater = DataUpdaterPrototype.getInstance(alt.Player.prototype);
// alt.Player.prototype.emit = EmitPrototype.getInstance(alt.Player.prototype);
// alt.Player.prototype.new = NewPrototype.getInstance(alt.Player.prototype);

// alt.Player.prototype.save = SavePrototype.getInstance(alt.Player.prototype);
// alt.Player.prototype.select = SelectPrototype.getInstance(alt.Player.prototype);
// alt.Player.prototype.set = SetPrototype.getInstance(alt.Player.prototype);
// alt.Player.prototype.sync = SyncPrototype.getInstance(alt.Player.prototype);
