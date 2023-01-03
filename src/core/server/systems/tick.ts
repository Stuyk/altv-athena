import { Character } from '@AthenaShared/interfaces/character';
import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Athena } from '../api/athena';
import { DEFAULT_CONFIG } from '../athena/main';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { Injections } from './injections';
import { PlayerInjectionNames, PlayerSaveTickCallback } from './injections/player';

const timeBetweenPings = 4950;

alt.onClient(SYSTEM_EVENTS.PLAYER_TICK, handlePing);

export async function onTick(player: alt.Player): Promise<void> {
    let injections: Partial<Character> = {};

    if (!player || !player.valid || !player.data) {
        return;
    }

    const dist = Athena.utility.vector.distance2d(player.pos, player.data.pos as alt.Vector2);

    if (player && player.pos && dist >= 1) {
        injections.pos = player.pos;
    }

    if (player.health !== player.data.health) {
        injections.health = player.health;
    }

    if (player.armour !== player.data.armour) {
        injections.armour = player.armour;
    }

    const saveTickInjections = Injections.get<PlayerSaveTickCallback>(PlayerInjectionNames.PLAYER_SAVE_TICK);
    for (const callback of saveTickInjections) {
        try {
            injections = { ...injections, ...callback(player) };
        } catch (err) {
            console.warn(`Got Save Injection Error for Player: ${err}`);
            continue;
        }
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
 * @param {alt.Player} player
 * @return {*}
 */
function handlePing(player: alt.Player): void {
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
        if (!player.vehicle.nextSave || Date.now() > player.vehicle.nextSave) {
            player.vehicle.nextSave = Date.now() + DEFAULT_CONFIG.TIME_BETWEEN_VEHICLE_SAVES;
            VehicleFuncs.update(player.vehicle);
        }
    }
}
