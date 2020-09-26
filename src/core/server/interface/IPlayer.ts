import * as alt from 'alt-server';
import { ICharacter, ICharacterDefaults } from './ICharacter';
import { IDiscordUser } from './IDiscordUser';
import { Database, getDatabase } from 'simplymongo';
import { CurrencyTypes } from '../enums/currency';

const db: Database = getDatabase();

export class IPlayer extends alt.Player {
    public pendingLogin?: boolean; // Used when a player is pending login.
    public discordToken?: string; // Used to assist with loggin in a player through oAuth2.
    public discord?: IDiscordUser;
    public data?: ICharacter;

    constructor() {
        super();
    }

    /**
     * Used to save a single field.
     * @param  {string} fieldName
     * @param  {any} fieldValue
     */
    private async saveField(fieldName: string, fieldValue: any) {
        await db.updatePartialData(this.data._id, { [fieldName]: fieldValue }, 'characters');
    }

    /**
     * Save a data object for the player based on their id.
     * @param  {ICharacter} dataObject
     */
    private async savePartial(dataObject: ICharacter) {
        await db.updatePartialData(this.data._id, { ...dataObject }, 'characters');
    }

    /**
     * Initialize default player data.
     */
    init() {
        this.data = Object.assign({}, ICharacterDefaults);
    }

    /**
     * Apply character data overriding default values on connect.
     * @param  {ICharacter} data
     */
    initData(data: ICharacter) {
        Object.keys(data).forEach((key) => {
            this.data[key] = data[key];
        });
    }

    /**
     * Add some cash to a player.
     * @param  {number} amount
     */
    addCurrency(type: CurrencyTypes, amount: number) {
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
     * Remove cash from the player.
     * @param  {number} amount
     */
    removeCurrency(type: CurrencyTypes, amount: number) {
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
    setCurrency(type: CurrencyTypes, amount: number) {
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
}
