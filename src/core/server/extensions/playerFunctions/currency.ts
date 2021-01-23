import * as alt from 'alt-server';
import { CurrencyTypes } from '../../../shared/enums/currency';
import save from './save';
import emit from './emit';

/**
 * Add currency type to the player.
 * @param {CurrencyTypes} type
 * @param {number} amount
 * @return {boolean} Success?
 * @memberof CurrencyPrototype
 */
function add(p: alt.Player, type: CurrencyTypes, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        p.data[type] += amount;
        emit.meta(p, type, p.data[type]);
        save.field(p, type, p.data[type]);
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
function sub(p: alt.Player, type: CurrencyTypes, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        p.data[type] -= amount;
        emit.meta(p, type, p.data[type]);
        save.field(p, type, p.data[type]);
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
function set(p: alt.Player, type: CurrencyTypes, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        p.data[type] = amount;
        emit.meta(p, type, p.data[type]);
        save.field(p, type, p.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

export default {
    set,
    sub,
    add
};
