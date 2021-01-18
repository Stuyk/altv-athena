import * as alt from 'alt-server';
import { View_Events_Creator } from '../../../shared/enums/views';
import { CurrencyTypes } from '../../../shared/enums/currency';
import { World } from '../../systems/world';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';

export interface SyncPrototype {
    /**
     * Synchronize currency data like bank, cash, etc.
     * @memberof SyncPrototype
     */
    currencyData(): void;

    /**
     * Synchronize player appearance.
     * @memberof SyncPrototype
     */
    appearance(): void;

    /**
     * Synchronize the player inventory, equipment, toolbar, etc.
     * @memberof SyncPrototype
     */
    inventory(): void;

    /**
     * Synchronize player data like ping, position, etc.
     * @memberof SyncPrototype
     */
    syncedMeta(): void;

    /**
     * Update the player's time to match server time.
     * @memberof SyncPrototype
     */
    time(): void;

    /**
     * Update the player's weather to match server weather based on grid space.
     * @memberof SyncPrototype
     */
    weather(): void;
}

export function bind() {
    const _this = this;
    _this.currencyData = currencyData;
    _this.appearance = appearance;
    _this.inventory = inventory;
    _this.syncedMeta = syncedMeta;
    _this.time = time;
    _this.weather = weather;
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

function inventory(): void {
    const p: alt.Player = (this as unknown) as alt.Player;

    if (!p.data.inventory) {
        p.data.inventory = new Array(6);
        for (let i = 0; i < p.data.inventory.length; i++) {
            p.data.inventory[i] = [];
        }
    }

    if (!p.data.toolbar) {
        p.data.toolbar = [];
    }

    if (!p.data.equipment) {
        p.data.equipment = [];
    }

    p.emit().meta('inventory', p.data.inventory);
    p.emit().meta('equipment', p.data.equipment);
    p.emit().meta('toolbar', p.data.toolbar);
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

function time(): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.emit().event(SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.hour, World.minute);
}

function weather(): void {
    const p: alt.Player = (this as unknown) as alt.Player;
    p.gridSpace = World.getGridSpace(p);
    p.currentWeather = World.getWeatherByGrid(p.gridSpace);
    p.emit().meta('gridSpace', p.gridSpace);
    p.emit().event(SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, p.currentWeather);
}
