import * as alt from 'alt-server';

import { CurrencyTypes } from '../../../shared/enums/currency';
import emit from './emit';
import save from './save';

/**
 * Add currency type to the player.
 * @param {CurrencyTypes} type
 * @param {number} amount
 * @return {boolean} Success?
 * @memberof CurrencyPrototype
 */
function add(player: alt.Player, type: CurrencyTypes, amount: number): boolean {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }

    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        const originalValue = player.data[type];
        player.data[type] = parseFloat((player.data[type] + amount).toFixed(2));

        // Verify that the value was updated.
        if (originalValue > player.data[type]) {
            player.data[type] = originalValue;
            return false;
        }

        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Remove currency type from the player.
 * @param {CurrencyTypes} type
 * @param {number} amount
 * @return {boolean} Success?
 * @memberof CurrencyPrototype
 */
function sub(player: alt.Player, type: CurrencyTypes, amount: number): boolean {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }

    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        const originalValue = player.data[type];
        player.data[type] = parseFloat((player.data[type] - amount).toFixed(2));

        // Verify that the value was updated.
        if (originalValue < player.data[type]) {
            player.data[type] = originalValue;
            return false;
        }

        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Replace the current currency type value with this exact value.
 * @param {CurrencyTypes} type Type of currency we are modifying.
 * @param {number} amount The amount we want to set that type to.
 * @return {*}  {boolean}
 * @memberof CurrencyPrototype
 */
function set(player: alt.Player, type: CurrencyTypes, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        player.data[type] = amount;
        emit.meta(player, type, player.data[type]);
        save.field(player, type, player.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

function subAllCurrencies(player: alt.Player, amount: number): boolean {
    if (player.data.cash + player.data.bank < amount) {
        return false;
    }

    let amountLeft = amount;

    if (player.data.cash - amountLeft <= -1) {
        amountLeft = amountLeft - player.data.cash;
        player.data.cash = 0;
    } else {
        player.data.cash = player.data.cash - amountLeft;
        amountLeft = 0;
    }

    if (amountLeft >= 1) {
        player.data.bank = player.data.bank - amountLeft;
    }

    save.field(player, CurrencyTypes.CASH, player.data[CurrencyTypes.CASH]);
    save.field(player, CurrencyTypes.BANK, player.data[CurrencyTypes.BANK]);
    emit.meta(player, CurrencyTypes.BANK, player.data[CurrencyTypes.BANK]);
    emit.meta(player, CurrencyTypes.CASH, player.data[CurrencyTypes.CASH]);
    return true;
}

/**
 * Used to override an existing Athena.player.inventory function.
 * Requires the same exact name of the function, and the parameters.
 *
 * @param {string} functionName
 * @param {(player: alt.Player, ...args: any[]) => void} callback
 */
function override(functionName: string, callback: (player: alt.Player, ...args: any[]) => void) {
    if (!exports[functionName]) {
        alt.logError(`Athena.player.currency does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

export const exports = {
    set,
    sub,
    add,
    subAllCurrencies,
    override,
};

export default exports;
