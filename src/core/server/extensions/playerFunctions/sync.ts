import * as alt from 'alt-server';
import { View_Events_Creator } from 'core/shared/enums/views';
import { CurrencyTypes } from 'core/shared/enums/currency';
import { World } from 'core/server/systems/world';
import { SYSTEM_EVENTS } from 'core/shared/enums/system';
import emit from './emit';
import save from './save';
import { DEFAULT_CONFIG } from 'core/server/athena/main';

/**
 * Synchronize currency data like bank, cash, etc.
 * @memberof SyncPrototype
 */
function currencyData(p: alt.Player): void {
    const keys: (keyof typeof CurrencyTypes)[] = <(keyof typeof CurrencyTypes)[]>Object.keys(CurrencyTypes);
    for (const key of keys) {
        const currencyName: string = CurrencyTypes[key];
        emit.meta(p, currencyName, p.data[currencyName]);
    }
}
/**
 * Synchronize player appearance.
 * @memberof SyncPrototype
 */
function appearance(p: alt.Player): void {
    if (p.data.appearance.sex === 0) {
        p.model = 'mp_f_freemode_01';
    } else {
        p.model = 'mp_m_freemode_01';
    }

    p.setSyncedMeta('Name', p.data.name);
    emit.meta(p, 'appearance', p.data.appearance);
    alt.emitClient(p, View_Events_Creator.Sync, p.data.appearance);
}

function inventory(p: alt.Player): void {
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

    emit.meta(p, 'inventory', p.data.inventory);
    emit.meta(p, 'equipment', p.data.equipment);
    emit.meta(p, 'toolbar', p.data.toolbar);
}

/**
 * Updates synced meta for the current player.
 * Basically updates data that may not be fully accessible everywhere.
 * @memberof SyncPrototype
 */
function syncedMeta(p: alt.Player): void {
    p.setSyncedMeta('Ping', p.ping);
    p.setSyncedMeta('Position', p.pos);
}
/**
 * Update the player's time to match server time.
 * @memberof SyncPrototype
 */
function time(p: alt.Player): void {
    alt.emitClient(p, SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.hour, World.minute);
}

/**
 * Update the player's weather to match server weather based on grid space.
 * @memberof SyncPrototype
 */
function weather(p: alt.Player): void {
    p.gridSpace = World.getGridSpace(p);
    p.currentWeather = World.getWeatherByGrid(p.gridSpace);
    emit.meta(p, 'gridSpace', p.gridSpace);
    alt.emitClient(p, SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, p.currentWeather);
}

function food(p: alt.Player): void {
    if (p.data.isDead && p.data.food <= 0) {
        p.data.food = 100;
        emit.meta(p, 'food', p.data.food);
        return;
    }

    if (p.data.food === undefined || p.data.food === null) {
        p.data.food = 100;
    }

    p.data.food -= DEFAULT_CONFIG.FOOD_REMOVAL_RATE;

    if (p.data.food <= 0) {
        p.data.food = 0;
    }

    emit.meta(p, 'food', p.data.food);
    save.field(p, 'food', p.data.food);
}

function water(p: alt.Player): void {
    if (p.data.isDead && p.data.water <= 0) {
        p.data.water = 100;
        emit.meta(p, 'water', p.data.water);
        return;
    }

    if (p.data.water === undefined || p.data.water === null) {
        p.data.water = 100;
    }

    p.data.water -= DEFAULT_CONFIG.WATER_REMOVAL_RATE;

    if (p.data.water <= 0) {
        p.data.water = 0;
    }

    emit.meta(p, 'water', p.data.water);
    save.field(p, 'water', p.data.water);
}

function vehicles(p: alt.Player): void {
    if (!p.data.vehicles) {
        emit.meta(p, 'vehicles', []);
        return;
    }

    emit.meta(p, 'vehicles', p.data.vehicles);
}

export default {
    appearance,
    currencyData,
    food,
    inventory,
    syncedMeta,
    time,
    vehicles,
    water,
    weather
};
