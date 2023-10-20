import * as alt from 'alt-server';

import { Character } from '@AthenaShared/interfaces/character.js';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced.js';
import { SYSTEM_EVENTS } from '../../shared/enums/system.js';
import * as Athena from '../api/index.js';

const timeBetweenPings = 4950;

alt.onClient(SYSTEM_EVENTS.PLAYER_TICK, handlePing);

/**
 * Used to save the player every once in a while.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {Promise<void>}
 */
export async function onTick(player: alt.Player): Promise<void> {
    if (Overrides.onTick) {
        return Overrides.onTick(player);
    }

    let injections: Partial<Character> = {};

    if (!player || !player.valid) {
        return;
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return;
    }

    const dist = Athena.utility.vector.distance2d(player.pos, data.pos as alt.Vector2);

    if (player && player.pos && dist >= 1) {
        injections.pos = player.pos;
    }

    if (player.health !== data.health) {
        injections.health = player.health;
    }

    if (player.armour !== data.armour) {
        injections.armour = player.armour;
    }

    if (Object.keys(injections).length <= 0) {
        return;
    }

    Athena.document.character.setBulk(player, injections);
}

/**
 * This is a tick event that is sent up from the player.
 * This tick event is then used to process specific player events.
 * This varies from player revival, coordinate processing, etc.
 * Helps push the load onto the server, rather than the player.
 * @param {alt.Player} player An alt:V Player Entity
 * @return {void}
 */
function handlePing(player: alt.Player): void {
    if (Overrides.handlePing) {
        return Overrides.handlePing(player);
    }

    if (!player.nextPingTime) {
        player.nextPingTime = Date.now() + timeBetweenPings;
    }

    if (Date.now() < player.nextPingTime) {
        return;
    }

    player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
    player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
    player.nextPingTime = Date.now() + timeBetweenPings;

    // Handles General Saving / Synchronization
    onTick(player);
    Athena.player.sync.syncedMeta(player);

    if (!player.nextPlayTime || Date.now() > player.nextPlayTime) {
        player.nextPlayTime = Date.now() + 60000;
        Athena.player.sync.playTime(player);
    }

    // Only the driver of the vehicle should be responsible for vehicle updates.
    if (player.vehicle && player.vehicle.driver === player) {
        Athena.vehicle.controls.update(player.vehicle);
    }
}

interface TickFuncs {
    onTick: typeof onTick;
    handlePing: typeof handlePing;
}

const Overrides: Partial<TickFuncs> = {};

export function override(functionName: 'onTick', callback: typeof onTick);
export function override(functionName: 'handlePing', callback: typeof handlePing);
/**
 * Used to override player tick functionality
 *
 *
 * @param {keyof TickFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof TickFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
