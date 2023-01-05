import * as alt from 'alt-server';
import { CurrencyTypes } from '@AthenaShared/enums/currency';
import { Athena } from '@AthenaServer/api/athena';

const Currency = {
    /**
     * Add currency type to the player.
     * @param {CurrencyTypes} type
     * @param {number} amount
     * @return {boolean} Success?
     * @memberof Currency
     */
    add(player: alt.Player, type: CurrencyTypes, amount: number): boolean {
        if (typeof amount === 'string') {
            amount = parseFloat(amount);
        }

        if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER - 1;
        }

        try {
            const data = Athena.document.character.get(player);
            const originalValue = data[type];
            const newValue = parseFloat((originalValue + amount).toFixed(2));

            if (originalValue > newValue) {
                return false;
            }

            Athena.document.character.set(player, type, newValue);
            Athena.player.emit.meta(player, type, newValue);
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
    sub(player: alt.Player, type: CurrencyTypes, amount: number): boolean {
        if (typeof amount === 'string') {
            amount = parseFloat(amount);
        }

        if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER - 1;
        }

        try {
            const data = Athena.document.character.get(player);
            if (typeof data[type] === 'undefined') {
                data[type] = 0;
            }

            const originalValue = data[type];
            const newValue = parseFloat((originalValue - amount).toFixed(2));

            // Verify that the value was updated.
            if (originalValue < data[type]) {
                return false;
            }

            Athena.document.character.set(player, type, newValue);
            Athena.player.emit.meta(player, type, newValue);
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
    set(player: alt.Player, type: CurrencyTypes, amount: number): boolean {
        if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER - 1;
        }

        try {
            Athena.document.character.set(player, type, amount);
            Athena.player.emit.meta(player, type, amount);
            return true;
        } catch (err) {
            return false;
        }
    },

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
