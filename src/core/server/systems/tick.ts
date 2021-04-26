import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { vehicleFuncs } from '../extensions/Vehicle';
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

    player.nextPingTime = Date.now() + timeBetweenPings;

    // Handles General Saving / Synchronization
    playerFuncs.save.onTick(player);
    playerFuncs.sync.syncedMeta(player);
    playerFuncs.sync.time(player);
    playerFuncs.sync.weather(player);

    // Updates Items on Ground for Player
    if (!player.nextItemSync || Date.now() > player.nextItemSync) {
        player.nextItemSync = Date.now() + DEFAULT_CONFIG.TIME_BETWEEN_INVENTORY_UPDATES;
        InventoryController.updateDroppedItemsAroundPlayer(player, false);
    }

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

    if (player.vehicle) {
        if (!player.vehicle.nextUpdate || Date.now() > player.vehicle.nextUpdate) {
            player.vehicle.nextUpdate = Date.now() + DEFAULT_CONFIG.TIME_BETWEEN_VEHICLE_UPDATES;
            vehicleFuncs.setter.updateFuel(player.vehicle);
        }

        if (!player.vehicle.nextSave || Date.now() > player.vehicle.nextSave) {
            player.vehicle.nextSave = Date.now() + DEFAULT_CONFIG.TIME_BETWEEN_VEHICLE_SAVES;
            const owner = alt.Player.all.find((p) => p.id === player.vehicle.player_id);
            if (owner) {
                vehicleFuncs.save.data(owner, player.vehicle);
            }
        }
    }
}
