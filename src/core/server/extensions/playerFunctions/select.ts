import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../enums/athenaEvents';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/Character';
import { DEFAULT_CONFIG } from '../../athena/main';
import { BlipController } from '../../systems/blip';
import ChatController from '../../systems/chat';
import { MarkerController } from '../../systems/marker';
import emit from './emit';
import safe from './safe';
import setter from './setter';
import sync from './sync';
import { TextLabelController } from '../../systems/textlabel';
import save from './save';
import { LocaleController } from '../../../shared/locale/locale';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { World } from '../../systems/world';
import { HologramController } from '../../systems/hologram';

/**
 * Select a character based on the character data provided.
 * @param {Partial<Character>} characterData
 * @return {*}  {Promise<void>}
 * @memberof SelectPrototype
 */
async function selectCharacter(player: alt.Player, characterData: Partial<Character>): Promise<void> {
    player.data = { ...characterData };
    sync.appearance(player);
    alt.emitClient(player, SYSTEM_EVENTS.TICKS_START);

    // Set player dimension to zero.
    player.dimension = 0;
    setter.frozen(player, true);

    alt.setTimeout(() => {
        if (player.data.pos) {
            safe.setPosition(player, player.data.pos.x, player.data.pos.y, player.data.pos.z);
        } else {
            safe.setPosition(
                player,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z
            );
        }

        // Save immediately after using exterior login.
        if (player.data.exterior) {
            safe.setPosition(player, player.data.exterior.x, player.data.exterior.y, player.data.exterior.z);
            player.data.exterior = null;
            save.field(player, 'exterior', player.data.exterior);
        }

        // Check if health exists.
        if (player.data.health) {
            safe.addHealth(player, player.data.health, true);
        } else {
            safe.addHealth(player, 200, true);
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
        sync.water(player);
        sync.food(player);
        sync.vehicles(player);

        // Information
        const hour = `${World.hour}`.length <= 1 ? `0${World.hour}` : `${World.hour}`;
        const minute = `${World.minute}`.length <= 1 ? `0${World.minute}` : `${World.minute}`;
        emit.message(player, `${LocaleController.get(LOCALE_KEYS.WORLD_TIME_IS, hour, minute)}`);

        // Propagation
        ChatController.populateCommands(player);
        BlipController.populateGlobalBlips(player);
        MarkerController.populateGlobalMarkers(player);
        TextLabelController.populateGlobalLabels(player);
        HologramController.populateHolograms(player);

        // Voice Service
        alt.emit(SYSTEM_EVENTS.VOICE_ADD, player);

        // Finish Selection
        alt.emit(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, player);
    }, 500);

    // Delete unused data from the Player.
    delete player.currentCharacters;
}

export default {
    character: selectCharacter
};
