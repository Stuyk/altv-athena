import * as alt from 'alt-server';
import { View_Events_Creator } from '../../../shared/enums/views';
import { CurrencyTypes } from '../../../shared/enums/currency';
import { World } from '../../systems/world';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import emit from './emit';
import { DEFAULT_CONFIG } from '../../athena/main';
import { playerFuncs } from '../Player';
import save from './save';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';

/**
 * Synchronize currency data like bank, cash, etc.
 * @memberof SyncPrototype
 */
function currencyData(player: alt.Player): void {
    const keys: (keyof typeof CurrencyTypes)[] = <(keyof typeof CurrencyTypes)[]>Object.keys(CurrencyTypes);
    for (const key of keys) {
        const currencyName: string = CurrencyTypes[key];
        emit.meta(player, currencyName, player.data[currencyName]);
    }
}
/**
 * Synchronize player appearance.
 * @memberof SyncPrototype
 */
function appearance(player: alt.Player): void {
    if (player.data.appearance.sex === 0) {
        player.model = 'mp_f_freemode_01';
    } else {
        player.model = 'mp_m_freemode_01';
    }

    player.setSyncedMeta('Name', player.data.name);
    emit.meta(player, 'appearance', player.data.appearance);
    alt.emitClient(player, View_Events_Creator.Sync, player.data.appearance);
}

function inventory(player: alt.Player): void {
    if (!player.data.inventory) {
        player.data.inventory = new Array(6);
        for (let i = 0; i < player.data.inventory.length; i++) {
            player.data.inventory[i] = [];
        }
    }

    if (!player.data.toolbar) {
        player.data.toolbar = [];
    }

    if (!player.data.equipment) {
        player.data.equipment = [];
    }

    emit.meta(player, 'inventory', player.data.inventory);
    emit.meta(player, 'equipment', player.data.equipment);
    emit.meta(player, 'toolbar', player.data.toolbar);
}

/**
 * Updates synced meta for the current player.
 * Basically updates data that may not be fully accessible everywhere.
 * @memberof SyncPrototype
 */
function syncedMeta(player: alt.Player): void {
    player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
    player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
    player.setSyncedMeta(PLAYER_SYNCED_META.WANTED_LEVEL, player.wanted);
}

/**
 * Update the player's time to match server time.
 * @memberof SyncPrototype
 */
function time(player: alt.Player): void {
    alt.emitClient(player, SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.hour, World.minute);
}

/**
 * Update the player's weather to match server weather based on grid space.
 * @memberof SyncPrototype
 */
function weather(player: alt.Player): void {
    player.gridSpace = World.getGridSpace(player);
    player.currentWeather = World.getWeatherByGrid(player.gridSpace);
    emit.meta(player, 'gridSpace', player.gridSpace);
    alt.emitClient(player, SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, player.currentWeather);
}

function playTime(player: alt.Player): void {
    if (!player.data.hours) {
        player.data.hours = 0;
    }

    player.data.hours += 0.0166666666666667;
    save.field(player, 'hours', player.data.hours);
}

function food(player: alt.Player): void {
    if (player.data.isDead && player.data.food <= 0) {
        player.data.food = 100;
        emit.meta(player, 'food', player.data.food);
        return;
    }

    playerFuncs.safe.addFood(player, -DEFAULT_CONFIG.FOOD_REMOVAL_RATE);
}

function water(player: alt.Player): void {
    if (player.data.isDead && player.data.water <= 0) {
        player.data.water = 100;
        emit.meta(player, 'water', player.data.water);
        return;
    }

    playerFuncs.safe.addWater(player, -DEFAULT_CONFIG.FOOD_REMOVAL_RATE);
}

function vehicles(player: alt.Player): void {
    if (!player.data.vehicles) {
        emit.meta(player, 'vehicles', []);
        return;
    }

    emit.meta(player, 'vehicles', player.data.vehicles);
}

export default {
    appearance,
    currencyData,
    food,
    inventory,
    playTime,
    syncedMeta,
    time,
    vehicles,
    water,
    weather
};
