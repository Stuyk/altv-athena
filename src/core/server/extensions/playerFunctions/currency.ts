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

export default {
    set,
    sub,
    add,
    subAllCurrencies
};
