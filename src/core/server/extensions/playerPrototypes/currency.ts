import { CurrencyTypes } from '../../enums/currency';

export function currencyAddPrototype(type: CurrencyTypes, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] += amount;
        this.emitMeta(type, this.data[type]);
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

export function currencySubPrototype(type: CurrencyTypes, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] -= amount;
        this.emitMeta(type, this.data[type]);
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

export function currencySetPrototype(type: CurrencyTypes, amount: number): boolean {
    if (amount > Number.MAX_SAFE_INTEGER) {
        amount = Number.MAX_SAFE_INTEGER - 1;
    }

    try {
        this.data[type] = amount;
        this.emitMeta(type, this.data[type]);
        this.saveField(type, this.data[type]);
        return true;
    } catch (err) {
        return false;
    }
}

export function currencyUpdatePrototype(): void {
    const keys: (keyof typeof CurrencyTypes)[] = <(keyof typeof CurrencyTypes)[]>Object.keys(CurrencyTypes);
    for (const key of keys) {
        const currencyName: string = CurrencyTypes[key];
        this.emitMeta(currencyName, this.data[currencyName]);
    }
}
