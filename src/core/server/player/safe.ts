import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced';
import * as Athena from '@AthenaServer/api';

/**
 * Safely set a player's position.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @memberof SafePrototype
 */
export function setPosition(player: alt.Player, x: number, y: number, z: number, doNotInvokeEventCall = false): void {
    if (!doNotInvokeEventCall) {
        Athena.events.player.trigger('player-pos-set', player, player.pos);
    }

    if (!player.hasModel) {
        player.hasModel = true;
        player.spawn(x, y, z, 0);
        player.model = `mp_m_freemode_01`;
    }

    const pos = new alt.Vector3(x, y, z);
    if (player.vehicle && player.vehicle.driver === player) {
        player.vehicle.pos = pos;
    } else {
        player.pos = pos;
    }
}
/**
 * Safely add health to this player.
 * @param {alt.Player} player
 * @param {number} value 99-199
 * @param {boolean} exactValue
 * @memberof SafePrototype
 */
export function addHealth(
    player: alt.Player,
    value: number,
    exactValue: boolean = false,
    doNotInvokeEventCall = false,
) {
    if (!doNotInvokeEventCall) {
        Athena.events.player.trigger('player-health-set', player, player.health);
    }

    if (exactValue) {
        player.health = value;
        return;
    }

    if (player.health + value > 199) {
        player.health = 199;
        return;
    }

    player.health = player.health + value;
}

/**
 * Safely subtract health to this player.
 * @param {alt.Player} player
 * @param {number} value 99-199
 * @param {boolean} exactValue
 * @memberof SafePrototype
 */
export function subHealth(
    player: alt.Player,
    value: number,
    exactValue: boolean = false,
    doNotInvokeEventCall = false,
) {
    if (!doNotInvokeEventCall) {
        Athena.events.player.trigger('player-health-set', player, player.health);
    }

    if (exactValue) {
        player.health = value;
        return;
    }

    if (player.health - value < 0) {
        player.health = 0;
        return;
    }

    player.health = player.health - value;
}

/**
 * Safely add armour to this player.
 * @param {number} value 1-100
 * @param {boolean} exactValue
 * @memberof SafePrototype
 */
export function addArmour(
    player: alt.Player,
    value: number,
    exactValue: boolean = false,
    doNotInvokeEventCall = false,
): void {
    if (!doNotInvokeEventCall) {
        Athena.events.player.trigger('player-armour-set', player, player.armour);
    }

    if (exactValue) {
        player.armour = value;
        return;
    }

    if (player.armour + value > 100) {
        player.armour = 100;
        return;
    }

    player.armour = player.armour + value;
}

/**
 * Safely subtracts armour to this player.
 * @param {number} value 1-100
 * @param {boolean} exactValue
 * @memberof SafePrototype
 */
export function subArmour(
    player: alt.Player,
    value: number,
    exactValue: boolean = false,
    doNotInvokeEventCall = false,
): void {
    if (!doNotInvokeEventCall) {
        Athena.events.player.trigger('player-armour-set', player, player.armour);
    }

    if (exactValue) {
        player.armour = value;
        return;
    }

    if (player.armour - value < 100) {
        player.armour = 0;
        return;
    }

    player.armour = player.armour - value;
}
export function setDimension(player: alt.Player, value: number) {
    player.dimension = value;
    player.setSyncedMeta(PLAYER_SYNCED_META.DIMENSION, value);
}

interface SafeFunctions {
    setPosition: typeof setPosition;
    addHealth: typeof addHealth;
    subHealth: typeof subHealth;
    addArmour: typeof addArmour;
    subArmour: typeof subArmour;
    setDimension: typeof setDimension;
}

const Overrides: Partial<SafeFunctions> = {};

export function override(functionName: 'setPosition', callback: typeof setPosition);
export function override(functionName: 'addHealth', callback: typeof addHealth);
export function override(functionName: 'subHealth', callback: typeof subHealth);
export function override(functionName: 'addArmour', callback: typeof addArmour);
export function override(functionName: 'subArmour', callback: typeof subArmour);
export function override(functionName: 'setDimension', callback: typeof setDimension);
export function override(functionName: keyof SafeFunctions, callback: any): void {
    Overrides[functionName] = callback;
}
