import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import VehicleFuncs from '../extensions/VehicleFuncs';
import { InventoryController } from '../views/inventory';

const timeBetweenPings = 4950;

alt.onClient(SYSTEM_EVENTS.PLAYER_TICK, handlePing);

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
    playerFuncs.save.onTick(player);
    playerFuncs.sync.syncedMeta(player);
    playerFuncs.sync.time(player);
    playerFuncs.sync.weather(player);

    // Updates Food & Water
    if (!player.nextFoodSync || Date.now() > player.nextFoodSync) {
        player.nextFoodSync = Date.now() + DEFAULT_CONFIG.TIME_BETWEEN_FOOD_UPDATES;
        playerFuncs.sync.food(player);
        playerFuncs.sync.water(player);
    }

    if (!player.nextPlayTime || Date.now() > player.nextPlayTime) {
        player.nextPlayTime = Date.now() + 60000;
        playerFuncs.sync.playTime(player);
    }

    // Only the driver of the vehicle should be responsible for vehicle updates.
    if (player.vehicle && player.vehicle.driver === player) {
        if (!player.vehicle.nextUpdate || Date.now() > player.vehicle.nextUpdate) {
            player.vehicle.nextUpdate = Date.now() + DEFAULT_CONFIG.TIME_BETWEEN_VEHICLE_UPDATES;
            VehicleFuncs.updateFuel(player.vehicle, timeBetweenPings);
        }

        if (!player.vehicle.nextSave || Date.now() > player.vehicle.nextSave) {
            player.vehicle.nextSave = Date.now() + DEFAULT_CONFIG.TIME_BETWEEN_VEHICLE_SAVES;
            VehicleFuncs.update(player.vehicle);
        }
    }
}
