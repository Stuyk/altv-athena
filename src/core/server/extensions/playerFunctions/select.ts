import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/Character';
import { DEFAULT_CONFIG } from '../../athena/main';
import ChatController from '../../systems/chat';
import { InteractionController } from '../../systems/interaction';
import emit from './emit';
import safe from './safe';
import setter from './setter';
import sync from './sync';

/**
 * Select a character based on the character data provided.
 * @param {Partial<Character>} characterData
 * @return {*}  {Promise<void>}
 * @memberof SelectPrototype
 */
async function selectCharacter(p: alt.Player, characterData: Partial<Character>): Promise<void> {
    p.data = { ...characterData };
    sync.appearance(p);
    alt.emitClient(p, SYSTEM_EVENTS.TICKS_START);

    // Set player dimension to zero.
    p.dimension = 0;
    setter.frozen(p, true);

    alt.setTimeout(() => {
        if (p.data.pos) {
            safe.setPosition(p, p.data.pos.x, p.data.pos.y, p.data.pos.z);
        } else {
            safe.setPosition(
                p,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z
            );
        }

        // Check if health exists.
        if (p.data.health) {
            safe.addHealth(p, p.data.health, true);
        } else {
            safe.addHealth(p, 200, true);
        }

        // Check if armour exists.
        if (p.data.armour) {
            safe.addArmour(p, p.data.armour, true);
        } else {
            safe.addArmour(p, 0, true);
        }

        // Resets their death status and logs them in as dead.
        if (p.data.isDead) {
            p.nextDeathSpawn = Date.now() + 30000;
            p.data.isDead = false;
            safe.addHealth(p, 0, true);
            emit.meta(p, 'isDead', true);
        } else {
            p.data.isDead = false;
            emit.meta(p, 'isDead', false);
        }

        sync.currencyData(p);
        sync.weather(p);
        sync.time(p);
        sync.inventory(p);
        sync.water(p);
        sync.food(p);

        // Propagation
        ChatController.populateCommands(p);
        InteractionController.populateCustomInteractions(p);
        alt.emit(SYSTEM_EVENTS.VOICE_ADD, p);
    }, 500);

    // Delete unused data from the Player.
    delete p.currentCharacters;
}

export default {
    character: selectCharacter
};
