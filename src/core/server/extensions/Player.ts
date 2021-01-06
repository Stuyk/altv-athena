import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { DiscordUser } from '../interface/DiscordUser';
import { CurrencyTypes } from '../enums/currency';
import { Appearance } from '../../shared/interfaces/Appearance';
import { CharacterInfo } from '../../shared/interfaces/CharacterInfo';
import { Account } from '../interface/Account';

import * as character from './playerPrototypes/character';
import * as emit from './playerPrototypes/emit';
import * as data from './playerPrototypes/data';
import * as death from './playerPrototypes/death';
import * as currency from './playerPrototypes/currency';
import * as safeSetters from './playerPrototypes/safeSetters';
import * as save from './playerPrototypes/save';
import * as chat from './playerPrototypes/chat';
import * as update from './playerPrototypes/update';

declare module 'alt-server' {
    export interface Player {
        // First Join Data
        pendingLogin?: boolean; // Used when a player is pending login.
        discordToken?: string; // Used to assist with loggin in a player through oAuth2.
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

        // Functions

        /**
         * emits data to the player's client-side.
         * @param  {string} eventName
         * @param  {any[]} ...args
         */
        emit(eventName: string, ...args: any[]);

        /**
         * emits meta to the players client-side. Accessible through 'alt.Player.local.meta'
         * @param  {string} key
         * @param  {any} value
         * @returns void
         */
        emitMeta(key: string, value: any): void;

        /**
         * Used to establish and create a new character based on passed Appearance data.
         * @param  {Appearance} appearance
         * @returns void
         */
        createNewCharacter(appearance: Appearance, info: CharacterInfo, name: string): void;

        /**
         * Add currency from this player based on currency type and amount.
         * @param  {CurrencyTypes} type
         * @param  {number} amount
         * @returns boolean
         */
        currencyAdd(type: CurrencyTypes, amount: number): boolean;

        /**
         * Set a currency type for this player to a specific value.
         * @param  {CurrencyTypes} type
         * @param  {number} amount
         * @returns boolean
         */
        currencySet(type: CurrencyTypes, amount: number): boolean;

        /**
         * Remove currecny from this player based on currency type and amount.
         * @param  {CurrencyTypes} type
         * @param  {number} amount
         * @returns boolean
         */
        currencySub(type: CurrencyTypes, amount: number): boolean;

        /**
         * Handles properly respawning a player a hospital.
         * @memberof Player
         */
        handleDeathRespawn(): void;

        /**
         * Initialize default values for player.data
         * @returns void
         */
        init(): void;

        /**
         * Bind database character data to this player.
         * @param  {Character} data
         * @returns void
         */
        initData(data: Character): void;

        /**
         * Safely set this player's position.
         * @param  {number} x
         * @param  {number} y
         * @param  {number} z
         * @returns void
         */
        safeSetPosition(x: number, y: number, z: number): void;

        /**
         * Safelty set this player's health value.
         * @param  {number} value
         * @returns void
         */
        safeAddHealth(value: number, exactValue: boolean): void;

        /**
         * Safely set this player's armour value.
         * @param  {number} value
         * @returns void
         */
        safeAddArmour(value: number, exactValue: boolean): void;

        /**
         * Save specific data for this player. Update `player.data` first.
         * @param  {string} fieldName
         * @param  {any} fieldValue
         * @returns void
         */
        saveField(fieldName: string, fieldValue: any): void;

        /**
         * Save multiple fields of data for this
         * @param  {Character} dataObject
         * @returns void
         */
        savePartial(dataObject: Character): void;

        /**
         * Saves player location, health, armour, etc.
         * @memberof Player
         */
        saveOnTick(): void;

        /**
         * Used to setup the player with character data.
         * @param  {Character} characterData
         * @returns void
         */
        selectCharacter(characterData: Character): void;

        /**
         * Append a message to a player's chat box.
         * @param {string} message
         * @memberof Player
         */
        send(message: string): void;

        /**
         * Used to set and initialize default and new values for an account.
         * @param {Partial<Account>} accountData
         * @memberof Player
         */
        setAccountData(accountData: Partial<Account>): Promise<void>;

        /**
         * Used to set and initialize default and new values for a character.
         * @param {Partial<CharacterData>} characterData
         * @memberof Player
         */
        setCharacterData(characterData: Partial<Character>): void;

        /**
         * Update the appearance of the player based on player.data.
         * @returns void
         */
        updateAppearance(): void;

        /**
         * Iterates through an Object based on its keys and appends it to player.data.
         * @param  {{}} dataObject
         * @returns void
         */
        updateDataByKeys(dataObject: {}, targetDataName: string): void;

        /**
         * Used to update shared player data.
         * Called from the tick system on the server-side.
         * @memberof Player
         */
        updateSyncedMetaStates(): void;
    }
}

// Emit Extensions
alt.Player.prototype.emit = emit.emitPrototype;
alt.Player.prototype.emitMeta = emit.emitMetaPrototype;

// Data Prototypes
alt.Player.prototype.init = data.initPrototype;
alt.Player.prototype.initData = data.initDataPrototype;
alt.Player.prototype.updateDataByKeys = data.updateDataByKeysPrototype;

// Currency Prototypes
alt.Player.prototype.currencyAdd = currency.currencyAddPrototype;
alt.Player.prototype.currencySub = currency.currencySubPrototype;
alt.Player.prototype.currencySet = currency.currencySetPrototype;

// Handlers - Handles specific event related tasks. Like respawn.
alt.Player.prototype.handleDeathRespawn = death.handleDeathRespawnPrototype;

// Safe Setters / Anticheat Prototypes
alt.Player.prototype.safeAddArmour = safeSetters.safeAddArmourPrototype;
alt.Player.prototype.safeAddHealth = safeSetters.safeAddHealthPrototype;
alt.Player.prototype.safeSetPosition = safeSetters.safeSetPositionPrototype;

// Database Saving and Handling
alt.Player.prototype.saveField = save.saveFieldPrototype;
alt.Player.prototype.saveOnTick = save.saveOnTickPrototype;
alt.Player.prototype.savePartial = save.savePartialPrototype;

// Character & Account Related
alt.Player.prototype.createNewCharacter = character.createNewCharacterPrototype;
alt.Player.prototype.selectCharacter = character.selectCharacterPrototype;
alt.Player.prototype.setAccountData = character.setAccountDataPrototype;
alt.Player.prototype.setCharacterData = character.setCharacterDataPrototype;
alt.Player.prototype.updateAppearance = character.updateAppearancePrototype;

// Chat Related
alt.Player.prototype.send = chat.sendPrototype;

// Update Related
alt.Player.prototype.updateSyncedMetaStates = update.updateSyncedMetaStatesPrototype;
