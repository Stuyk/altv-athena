import * as alt from 'alt-server';

import { CurrencyTypes } from '../../../shared/enums/currency';
import { Athena } from '../../api/athena';
import emit from './emit';
import save from './save';

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
            const originalValue = player.data[type]!;
            player.data[type] = parseFloat((player.data[type]! + amount).toFixed(2));

            // Verify that the value was updated.
            if (originalValue > player.data[type]!) {
                player.data[type] = originalValue;
                return false;
            }

            emit.meta(player, type, player.data[type]);
            save.save(player, type, player.data[type]);
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
            if (typeof player.data[type] === 'undefined') {
                player.data[type] = 0;
            }

            const originalValue = player.data[type]!;
            player.data[type] = parseFloat((player.data[type]! - amount).toFixed(2));

            // Verify that the value was updated.
            if (originalValue < player.data[type]!) {
                player.data[type] = originalValue;
                return false;
            }

            emit.meta(player, type, player.data[type]);
            save.save(player, type, player.data[type]);
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
            player.data[type] = amount;
            emit.meta(player, type, player.data[type]);
            save.save(player, type, player.data[type]);
            return true;
        } catch (err) {
            return false;
        }
    },

    subAllCurrencies(player: alt.Player, amount: number): boolean {
        if (typeof player.data.cash === 'undefined') {
            player.data.cash = 0;
        }

        if (typeof player.data.bank === 'undefined') {
            player.data.bank = 0;
        }

        if (player.data.cash + player.data.bank < amount) {
            return false;
        }

        let amountLeft = amount;
        let startCash = player.data.cash;
        let startBank = player.data.bank;

        if (player.data.cash - amountLeft <= -1) {
            amountLeft = amountLeft - startCash;
            startCash = 0;
        } else {
            startCash = startCash - amountLeft;
            amountLeft = 0;
        }

        if (amountLeft >= 1) {
            startBank = startBank - amountLeft;
        }

        Athena.state.setBulk(player, { bank: startBank, cash: startCash });
        emit.meta(player, CurrencyTypes.BANK, player.data[CurrencyTypes.BANK]);
        emit.meta(player, CurrencyTypes.CASH, player.data[CurrencyTypes.CASH]);
        return true;
    },
};

/**
 * It allows you to override any function in the Currency module
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Currency>(functionName: Key, callback: typeof Currency[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`Athena.player.currency does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

export const exports: typeof Currency & { override?: typeof override } = {
    ...Currency,
    override,
};

export default exports;
