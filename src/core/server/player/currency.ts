import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { CurrencyTypes } from '@AthenaShared/enums/currency.js';

export type DefaultCurrency = 'bank' | 'cash';

/**
 * Add currency type to the player.
 *
 * #### Example
 * ```ts
 * const didAddFullAmount = Athena.player.currency.add(somePlayer, 'cash', 25);
 * ```
 *
 * @param {CurrencyTypes} type
 * @param {number} amount
 * @return {boolean}
 *
 */
export function add<CustomCurrency>(
    player: alt.Player,
    type: DefaultCurrency | CustomCurrency,
    amount: number,
): boolean {
    if (typeof Overrides.add === 'function') {
        return Overrides.add(player, type, amount);
    }

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
}

/**
 * Remove currency type from the player.
 *
 * #### Example
 * ```ts
 * const didSubFullAmount = Athena.player.currency.sub(somePlayer, 'cash', 25);
 * ```
 *
 * @param {CurrencyTypes} type
 * @param {number} amount
 * @return {boolean}
 */
export function sub<CustomCurrency>(
    player: alt.Player,
    type: DefaultCurrency | CustomCurrency,
    amount: number,
): boolean {
    if (typeof Overrides.add === 'function') {
        return Overrides.sub(player, type, amount);
    }

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
}

/**
 * Replace the current currency type value with this exact value.
 *
 * #### Example
 * ```ts
 * const didSetFullAmount = Athena.player.currency.set(somePlayer, 'bank', 25);
 * ```
 *
 * @param {CurrencyTypes} type Type of currency we are modifying.
 * @param {number} amount The amount we want to set that type to.
 * @return {boolean}
 *
 */
export function set<CustomCurrency>(
    player: alt.Player,
    type: DefaultCurrency | CustomCurrency,
    amount: number,
): boolean {
    if (typeof Overrides.set === 'function') {
        return Overrides.set(player, type, amount);
    }

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
}

/**
 * Only subtracts 'bank' and 'cash' currency types.
 * Always takes from cash first.
 *
 * #### Example
 * ```ts
 * const didRemoveFullAmount = Athena.player.currency.subAllCurrencies(somePlayer, 25);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {number} amount
 * @return {boolean}
 */
export function subAllCurrencies(player: alt.Player, amount: number): boolean {
    if (typeof Overrides.subAllCurrencies === 'function') {
        return Overrides.subAllCurrencies(player, amount);
    }

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
}

interface CurrencyFunctions {
    add: typeof add;
    sub: typeof sub;
    subAllCurrencies: typeof subAllCurrencies;
    set: typeof set;
}

const Overrides: Partial<CurrencyFunctions> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'set', callback: typeof set);
export function override(functionName: 'sub', callback: typeof sub);
export function override(functionName: 'subAllCurrencies', callback: typeof subAllCurrencies);
/**
 * Used to override any internal currency functions.
 *
 *
 * @param {keyof CurrencyFunctions} functionName
 * @param {*} callback
 */
export function override(functionName: keyof CurrencyFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
