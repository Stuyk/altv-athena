import * as alt from 'alt-server';
import { CurrencyTypes } from '../../../shared/enums/currency';
import save from './save';
import emit from './emit';
import { AresFunctions, WASM } from '../../utility/wasmLoader';

const wasm = WASM.getFunctions<AresFunctions>('ares');

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
        const originalValue = p.data[type];
        p.data[type] = parseFloat(wasm.AthenaMath.add(p.data[type], amount).toFixed(2));

        // Verify that the value was updated.
        if (wasm.AthenaMath.isGreater(originalValue, p.data[type])) {
            p.data[type] = originalValue;
            return false;
        }

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
        const originalValue = p.data[type];
        p.data[type] = parseFloat(wasm.AthenaMath.sub(p.data[type], amount).toFixed(2));

        // Verify that the value was updated.
        if (!wasm.AthenaMath.isLesser(p.data[type], originalValue)) {
            p.data[type] = originalValue;
            return false;
        }

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

function subAllCurrencies(p: alt.Player, amount: number): boolean {
    if (p.data.cash + p.data.bank < amount) {
        return false;
    }

    let amountLeft = amount;

    if (wasm.AthenaMath.sub(p.data.cash, amountLeft) <= -1) {
        amountLeft = wasm.AthenaMath.sub(amountLeft, p.data.cash);
        p.data.cash = 0;
    } else {
        p.data.cash = wasm.AthenaMath.sub(p.data.cash, amountLeft);
        amountLeft = 0;
    }

    if (amountLeft >= 1) {
        p.data.bank = wasm.AthenaMath.sub(p.data.bank, amountLeft);
    }

    save.field(p, CurrencyTypes.CASH, p.data[CurrencyTypes.CASH]);
    save.field(p, CurrencyTypes.BANK, p.data[CurrencyTypes.BANK]);
    emit.meta(p, CurrencyTypes.BANK, p.data[CurrencyTypes.BANK]);
    emit.meta(p, CurrencyTypes.CASH, p.data[CurrencyTypes.CASH]);
    return true;
}

export default {
    set,
    sub,
    add,
    subAllCurrencies
};
