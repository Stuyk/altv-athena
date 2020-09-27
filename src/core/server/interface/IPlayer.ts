import * as alt from 'alt-server';
import { ICharacter, ICharacterDefaults } from './ICharacter';
import { IDiscordUser } from './IDiscordUser';
import { Database, getDatabase } from 'simplymongo';
import { CurrencyTypes } from '../enums/currency';

const db: Database = getDatabase();

declare module "alt-server" {
    export interface Player {
        // First Join Data
        pendingLogin?: boolean; // Used when a player is pending login.
        discordToken?: string; // Used to assist with loggin in a player through oAuth2.
        hasModel?: boolean;
         
         // Player Data
        discord?: IDiscordUser;
        data?: ICharacter;
     
         // Anti
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;

        // Functions
        currencyAdd(type: CurrencyTypes, amount: number): boolean;
        currencySet(type: CurrencyTypes, amount: number): boolean;
        currencySub(type: CurrencyTypes, amount: number): boolean;
        init(): void;
        initData(data: ICharacter): void;
        safeSetPosition(x: number, y: number, z: number): void;
        safeAddHealth(value: number): void;
        safeAddArmour(value: number): void;
        saveField(fieldName: string, fieldValue: any): void;
        savePartial(dataObject: ICharacter): void;
    }
}

/**
 * Used to save a single field.
 * @param  {string} fieldName
 * @param  {any} fieldValue
 */
alt.Player.prototype.saveField = async function saveField(fieldName: string, fieldValue: any) {
    await db.updatePartialData(this.data._id, { [fieldName]: fieldValue }, 'characters');
}

/**
 * Save a data object for the player based on their id.
 * @param  {ICharacter} dataObject
 */
alt.Player.prototype.savePartial = async function savePartial(dataObject: ICharacter) {
    await db.updatePartialData(this.data._id, { ...dataObject }, 'characters');
}

/**
 * Initialize default player data.
 */
alt.Player.prototype.init = function init() {
    this.data = Object.assign({}, ICharacterDefaults);
}

/**
 * Apply character data overriding default values on connect.
 * @param  {ICharacter} data
 */
alt.Player.prototype.initData = function initData(data: ICharacter) {
    Object.keys(data).forEach((key) => {
        this.data[key] = data[key];
    });
}

/**
 * Add some cash to a alt.Player.
 * @param  {number} amount
 */
alt.Player.prototype.currencyAdd = function currencyAdd(type: CurrencyTypes, amount: number) {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] += amount;
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Remove cash from the alt.Player.
 * @param  {number} amount
 */
alt.Player.prototype.currencySub = function currencySub(type: CurrencyTypes, amount: number) {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] -= amount;
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Set a player's cash to an amount.
 * @param  {number} amount
 */
alt.Player.prototype.currencySet = function currencySet(type: CurrencyTypes, amount: number) {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] = amount;
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Safely set their position.
 * @param  {Vector3} pos
 */
alt.Player.prototype.safeSetPosition = function safeSetPosition(x: number, y: number, z: number) {
    if (!this.hasModel) {
        this.hasModel = true;
        this.spawn(x, y, z, 0);
        this.model = `mp_m_freemode_01`;
    }

    this.acPosition = {x, y, z};
    this.pos = {x, y, z};
}

/**
 * Safely set their health.
 * @param  {number} value
 */
alt.Player.prototype.safeAddHealth = function safeAddHealth(value: number) {
    if (this.health + value > 200) {
        this.acHealth = 200;
        this.health = 200;
        return;
    }
    
    this.acHealth = this.health + value;
    this.health += value;
}

/**
 * Safely set their armour.
 * @param value 
 */
alt.Player.prototype.safeAddArmour = function safeAddArmour(value: number) {
    if (this.armour + value > 100) {
        this.acArmour = 100;
        this.armour = 100;
        return;
    }

    this.acArmour = this.armour + value;;
    this.armour += value;
}
