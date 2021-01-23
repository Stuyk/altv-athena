import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { InventoryController } from '../views/inventory';
import './interaction';
import './vehicle';

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

    // Respawns the Player
    if (player.nextDeathSpawn && Date.now() > player.nextDeathSpawn - 1000) {
        playerFuncs.set.respawned(player, null); // Uses null to find a hospital.
    }
}
