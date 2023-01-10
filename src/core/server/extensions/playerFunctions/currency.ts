import * as alt from 'alt-server';
import { CurrencyTypes } from '@AthenaShared/enums/currency';
import { Athena } from '@AthenaServer/api/athena';

type DefaultCurrency = 'bank' | 'cash';

const Currency = {
    /**
     * Add currency type to the player.
     * @param {CurrencyTypes} type
     * @param {number} amount
     * @return {boolean} Success?
     * @memberof Currency
     */
    add<CustomCurrency>(player: alt.Player, type: DefaultCurrency | CustomCurrency, amount: number): boolean {
        if (typeof amount === 'string') {
            amount = parseFloat(amount);
        }

        if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER - 1;
        }

        try {
            const actualType = String(type);
            const data = Athena.document.character.get(player);
            const originalValue = typeof data[actualType] === 'undefined' ? 0 : data[actualType];
            const newValue = parseFloat((originalValue + amount).toFixed(2));

            if (originalValue > newValue) {
                return false;
            }

            Athena.document.character.set(player, actualType, newValue);
            Athena.player.emit.meta(player, actualType, newValue);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    /**
     * Remove currency type from the player.
     * @param {CurrencyTypes} type
     * @param {number} amount
     * @return {boolean} Success?
     * @memberof CurrencyPrototype
     */
    sub<CustomCurrency>(player: alt.Player, type: DefaultCurrency | CustomCurrency, amount: number): boolean {
        if (typeof amount === 'string') {
            amount = parseFloat(amount);
        }

        if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER - 1;
        }

        try {
            const actualType = String(type);
            const data = Athena.document.character.get(player);
            const originalValue = typeof data[actualType] === 'undefined' ? 0 : data[actualType];
            const newValue = parseFloat((originalValue - amount).toFixed(2));

            // Verify that the value was updated.
            if (originalValue < data[actualType]) {
                return false;
            }

            Athena.document.character.set(player, type, newValue);
            Athena.player.emit.meta(player, actualType, newValue);
            return true;
        } catch (err) {
            return false;
        }
    },

    /**
     * Replace the current currency type value with this exact value.
     * @param {CurrencyTypes} type Type of currency we are modifying.
     * @param {number} amount The amount we want to set that type to.
     * @return {*}  {boolean}
     * @memberof CurrencyPrototype
     */
    set<CustomCurrency>(player: alt.Player, type: DefaultCurrency | CustomCurrency, amount: number): boolean {
        if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER - 1;
        }

        try {
            const actualType = String(type);
            Athena.document.character.set(player, actualType, amount);
            Athena.player.emit.meta(player, actualType, amount);
            return true;
        } catch (err) {
            return false;
        }
    },
    /**
     * Only subtracts 'bank' and 'cash' currency types.
     * Always takes from cash first.
     *
     * @param {alt.Player} player
     * @param {number} amount
     * @return {boolean}
     */
    subAllCurrencies(player: alt.Player, amount: number): boolean {
        const data = Athena.document.character.get(player);
        if (typeof data.cash === 'undefined') {
            data.cash = 0;
        }

        if (typeof data.bank === 'undefined') {
            data.bank = 0;
        }

        if (data.cash + data.bank < amount) {
            return false;
        }

        let amountLeft = amount;
        let startCash = data.cash;
        let startBank = data.bank;

        if (data.cash - amountLeft <= -1) {
            amountLeft = amountLeft - startCash;
            startCash = 0;
        } else {
            startCash = startCash - amountLeft;
            amountLeft = 0;
        }

        if (amountLeft >= 1) {
            startBank = startBank - amountLeft;
        }

        Athena.document.character.setBulk(player, { bank: startBank, cash: startCash });
        Athena.player.emit.meta(player, CurrencyTypes.BANK, startBank);
        Athena.player.emit.meta(player, CurrencyTypes.CASH, startCash);
        return true;
    },
};

/**
 * It allows you to override any function in the Currency module
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Currency>(functionName: Key, callback: typeof Currency[Key]): void {
    if (typeof funcs[functionName] === 'undefined') {
        alt.logError(`Athena.player.currency does not provide an export named ${functionName}`);
    }

    funcs[functionName] = callback;
}

export const funcs: typeof Currency & { override?: typeof override } = {
    ...Currency,
    override,
};

export default funcs;
