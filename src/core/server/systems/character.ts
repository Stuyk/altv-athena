import * as alt from 'alt-server';
import { Athena } from '../api/athena';
import { DEFAULT_CONFIG } from '../athena/main';
import { PlayerEvents } from '../events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Character } from '../../shared/interfaces/character';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { World } from './world';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { Item } from '../../shared/interfaces/item';
import { Global } from './global';

const Injections: { [key: string]: Array<(player: alt.Player) => void> } = {
    select: [],
    beforeSelect: [],
};

const Callbacks: { [key: string]: (player: alt.Player, ...args: any[]) => void } = {
    creator: null,
};

export class CharacterSystem {
    /**
     * Inject a function just before the character is spawned.
     * Will automatically run when a player has selected a character.
     *
     * @static
     * @param {(player: alt.Player) => void} callback
     * @memberof CharacterSystem
     */
    static selectInjections(callback: (player: alt.Player) => void) {
        Injections.select.push(callback);
    }

    /**
     * Inject a function after the player data is set.
     *
     * The functions are ran before the rest of the spawn code is ran.
     *
     * @static
     * @param {(player: alt.Player) => void} callback
     * @memberof CharacterSystem
     */
    static beforeSelectInjections(callback: (player: alt.Player) => void) {
        Injections.beforeSelect.push(callback);
    }

    /**
     * Allows a custom character creator to be shown.
     *
     * @static
     * @param {(player: alt.Player, ...args: any[]) => void} callback
     * @memberof CharacterSystem
     */
    static setCreatorCallback(callback: (player: alt.Player, ...args: any[]) => void) {
        Callbacks.creator = callback;
    }

    /**
     * Invokes the custom creator to be set.
     *
     * @static
     * @param {alt.Player} player
     * @param {...any[]} args
     * @memberof CharacterSystem
     */
    static invokeCreator(player: alt.Player, ...args: any[]) {
        if (!Callbacks.creator) {
            alt.logWarning(`No Character Creator Setup in CharacterSystem. Use CharacterSystem.setCreatorCallback`);
            return;
        }

        Callbacks.creator(player, ...args);
    }

    /**
     * The final step in the character selection system.
     *
     * After this step the player is spawned and synchronized.
     *
     * @static
     * @param {alt.Player} player
     * @param {Character} character
     * @memberof CharacterSystem
     */
    static async select(player: alt.Player, character: Character) {
        player.data = deepCloneObject(character);

        // Give the player an identifier if it does not already have one.
        // if (player.data.character_id !== undefined && player.data.character_id !== null) {
        //     Athena.player.emit.meta(player, metaName, player.data[metaName]);
        // }

        // Increase the value outright
        if (player.data.character_id === undefined || player.data.character_id === null) {
            await Global.increase('nextCharacterId', 1, 1);
            player.data.character_id = await Global.getKey<number>('nextCharacterId');
            await Athena.player.save.field(player, 'character_id', player.data.character_id);
        }

        alt.log(
            `Selected | ${player.data.name} | ID: (${player.id}) | Character ID: ${player.data.character_id} | Account: ${player.data.account_id}`,
        );

        for (let i = 0; i < Injections.beforeSelect.length; i++) {
            Injections.beforeSelect[i](player);
        }

        Athena.player.sync.appearance(player, player.data.appearance);

        if (player.data.equipment) {
            Athena.player.sync.equipment(player, player.data.equipment as Item[], player.data.appearance.sex === 1);
        }

        alt.emitClient(player, SYSTEM_EVENTS.TICKS_START);

        // Set player dimension to zero.
        Athena.player.safe.setDimension(player, 0);
        Athena.player.set.frozen(player, true);

        if (player.data.dimension) {
            Athena.player.safe.setDimension(player, player.data.dimension);
            Athena.player.emit.message(player, `Dimension: ${player.data.dimension}`);
        }

        alt.setTimeout(async () => {
            if (player.data.pos) {
                Athena.player.safe.setPosition(player, player.data.pos.x, player.data.pos.y, player.data.pos.z);
            } else {
                Athena.player.safe.setPosition(
                    player,
                    DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x,
                    DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y,
                    DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z,
                );
            }

            // Check if health exists.
            if (player.data.health) {
                Athena.player.safe.addHealth(player, player.data.health, true);
            } else {
                Athena.player.safe.addHealth(player, 200, true);
            }

            if (player.data.health <= 99) {
                Athena.player.set.dead(player);
            }

            // Check if armour exists.
            if (player.data.armour) {
                Athena.player.safe.addArmour(player, player.data.armour, true);
            } else {
                Athena.player.safe.addArmour(player, 0, true);
            }

            // Resets their death status and logs them in as dead.
            if (player.data.isDead) {
                player.nextDeathSpawn = Date.now() + 30000;
                player.data.isDead = false;
                Athena.player.safe.addHealth(player, 0, true);
                Athena.player.emit.meta(player, 'isDead', true);
            } else {
                player.data.isDead = false;
                Athena.player.emit.meta(player, 'isDead', false);
            }

            // Synchronization
            Athena.player.sync.currencyData(player);
            Athena.player.sync.weather(player);
            Athena.player.sync.time(player);
            Athena.player.sync.inventory(player);

            player.setSyncedMeta(PLAYER_SYNCED_META.NAME, player.data.name);
            player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
            player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
            player.setSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID, player.data._id.toString());

            // Information
            const hour = `${World.hour}`.length <= 1 ? `0${World.hour}` : `${World.hour}`;
            const minute = `${World.minute}`.length <= 1 ? `0${World.minute}` : `${World.minute}`;
            Athena.player.emit.message(player, `${LocaleController.get(LOCALE_KEYS.WORLD_TIME_IS, hour, minute)}`);

            // Propagation
            Athena.controllers.chat.populateCommands(player);
            Athena.controllers.blip.populateGlobalBlips(player);
            Athena.controllers.holograms.populateHolograms(player);

            // Vehicle Spawning
            if (!DEFAULT_CONFIG.SPAWN_ALL_VEHICLES_ON_START && DEFAULT_CONFIG.SPAWN_VEHICLES_ON_JOIN) {
                const vehicles = await Athena.vehicle.funcs.getPlayerVehicles(player.data._id);
                Athena.vehicle.funcs.spawnPlayerVehicles(vehicles);
            }

            // Handle Injections...
            for (let i = 0; i < Injections.select.length; i++) {
                Injections.select[i](player);
            }

            // Finish Selection
            Athena.player.set.frozen(player, false);
            player.visible = true;
            player.hasFullySpawned = true;
            PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, player);
        }, 500);
    }

    /**
     * Check if a character name is taken.
     *
     * @static
     * @param {string} name
     * @return {Promise<boolean>}
     * @memberof CharacterSystem
     */
    static async isNameTaken(name: string): Promise<boolean> {
        const result = await Athena.database.funcs.fetchData<Character>(
            'name',
            name,
            Athena.database.collections.Characters,
        );

        return result ? true : false;
    }
}
