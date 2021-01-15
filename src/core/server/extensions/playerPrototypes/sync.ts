import * as alt from 'alt-server';
import { View_Events_Creator } from '../../../shared/enums/views';
import { CurrencyTypes } from '../../../shared/enums/currency';

export interface SyncPrototype {
    currencyData(): void;
    appearance(): void;
    syncedMeta(): void;
}

export function bind() {
    const _this = this;
    _this.currencyData = currencyData;
    _this.appearance = appearance;
    _this.syncedMeta = syncedMeta;
    return _this;
}

/**
 * Synchronize and update currency balances for the player.
 * @memberof SyncPrototype
 */
function currencyData(): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    const keys: (keyof typeof CurrencyTypes)[] = <(keyof typeof CurrencyTypes)[]>Object.keys(CurrencyTypes);
    for (const key of keys) {
        const currencyName: string = CurrencyTypes[key];
        p.emit().meta(currencyName, p.data[currencyName]);
    }
}

/**
 * Synchronize the appearance of a player.
 * @memberof SyncPrototype
 */
function appearance(): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (p.data.appearance.sex === 0) {
        p.model = 'mp_f_freemode_01';
    } else {
        p.model = 'mp_m_freemode_01';
    }

    p.setSyncedMeta('Name', p.data.name);
    p.emit().meta('appearance', p.data.appearance);
    p.emit().event(View_Events_Creator.Sync, p.data.appearance);
}

/**
 * Updates synced meta for the current player.
 * Basically updates data that may not be fully accessible everywhere.
 * @memberof SyncPrototype
 */
function syncedMeta(): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    p.setSyncedMeta('Ping', p.ping);
    p.setSyncedMeta('Position', p.pos);
}
