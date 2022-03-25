import * as alt from 'alt-server';

import { ATHENA_EVENTS_PLAYER } from '../../../shared/enums/athenaEvents';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/character';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleController } from '../../../shared/locale/locale';
import { DEFAULT_CONFIG } from '../../athena/main';
import { PlayerEvents } from '../../events/playerEvents';
import { ServerBlipController } from '../../systems/blip';
import ChatController from '../../systems/chat';
import { HologramController } from '../../systems/hologram';
import { World } from '../../systems/world';
import { playerFuncs } from '../extPlayer';
import VehicleFuncs from '../vehicleFuncs';
import emit from './emit';
import safe from './safe';
import setter from './setter';
import sync from './sync';

/**
 * Select a character based on the character data provided.
 * @param {Partial<Character>} characterData
 * @return {Promise<void>}
 * @memberof SelectPrototype
 */
async function selectCharacter(player: alt.Player): Promise<void> {
    player.data = { ...player.currentCharacters[player.selectedCharacterIndex] };

    // Converts inventory from 2.0.3 to 3.0.0
    await playerFuncs.inventory.convert(player);

    sync.appearance(player, player.data.appearance);
    alt.emitClient(player, SYSTEM_EVENTS.TICKS_START);

    // Set player dimension to zero.
    safe.setDimension(player, 0);
    setter.frozen(player, true);

    alt.setTimeout(async () => {
        if (player.data.pos) {
            safe.setPosition(player, player.data.pos.x, player.data.pos.y, player.data.pos.z);
        } else {
            safe.setPosition(
                player,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z,
            );
        }

        // Check if health exists.
        if (player.data.health) {
            safe.addHealth(player, player.data.health, true);
        } else {
            safe.addHealth(player, 200, true);
        }

        if (player.data.health <= 99) {
            playerFuncs.set.dead(player);
        }

        // Check if armour exists.
        if (player.data.armour) {
            safe.addArmour(player, player.data.armour, true);
        } else {
            safe.addArmour(player, 0, true);
        }

        // Resets their death status and logs them in as dead.
        if (player.data.isDead) {
            player.nextDeathSpawn = Date.now() + 30000;
            player.data.isDead = false;
            safe.addHealth(player, 0, true);
            emit.meta(player, 'isDead', true);
        } else {
            player.data.isDead = false;
            emit.meta(player, 'isDead', false);
        }

        // Synchronization
        sync.currencyData(player);
        sync.weather(player);
        sync.time(player);
        sync.inventory(player);

        player.setSyncedMeta(PLAYER_SYNCED_META.NAME, player.data.name);
        player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
        player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
        player.setSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID, player.data._id.toString());

        // Information
        const hour = `${World.hour}`.length <= 1 ? `0${World.hour}` : `${World.hour}`;
        const minute = `${World.minute}`.length <= 1 ? `0${World.minute}` : `${World.minute}`;
        emit.message(player, `${LocaleController.get(LOCALE_KEYS.WORLD_TIME_IS, hour, minute)}`);

        // Propagation
        ChatController.populateCommands(player);
        ServerBlipController.populateGlobalBlips(player);
        HologramController.populateHolograms(player);

        // Vehicle Spawning
        if (!DEFAULT_CONFIG.SPAWN_ALL_VEHICLES_ON_START && DEFAULT_CONFIG.SPAWN_VEHICLES_ON_JOIN) {
            const vehicles = await VehicleFuncs.getPlayerVehicles(player.data._id);
            VehicleFuncs.spawnPlayerVehicles(vehicles);
        }

        // Finish Selection
        playerFuncs.set.frozen(player, false);
        player.visible = true;
        player.hasFullySpawned = true;
        PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, player);
    }, 500);

    // Delete unused data from the Player.
    delete player.currentCharacters;
}

export default {
    character: selectCharacter,
};
