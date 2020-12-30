import { CurrencyTypes } from '../../enums/currency';

export function currencyAddPrototype(type: CurrencyTypes, amount: number) {
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

export function currencySubPrototype(type: CurrencyTypes, amount: number) {
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

export function currencySetPrototype(type: CurrencyTypes, amount: number) {
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
