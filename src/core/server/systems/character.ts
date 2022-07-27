import * as alt from 'alt-server';
import { Athena } from '../api/athena';
import { DEFAULT_CONFIG } from '../athena/main';
import { PlayerEvents } from '../events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/athenaEvents';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Character, CharacterDefaults } from '../../shared/interfaces/character';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { World } from './world';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { Global } from './global';
import { CharacterCreateCallback, PlayerCallback, PlayerInjectionNames } from './injections/player';
import { Injections } from './injections';
import { Appearance } from '../../shared/interfaces/appearance';
import { CharacterInfo } from '../../shared/interfaces/characterInfo';

const Callbacks: { [key: string]: (player: alt.Player, ...args: any[]) => void } = {
    creator: null,
};

export class CharacterSystem {
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
     * Create a new character for a specific player.
     *
     * @static
     * @param {alt.Player} player
     * @param {Appearance} appearance
     * @param {CharacterInfo} info
     * @param {string} name
     * @return {Promise<boolean>}
     * @memberof CharacterSystem
     */
    static async create(
        player: alt.Player,
        appearance: Appearance,
        info: CharacterInfo,
        name: string,
    ): Promise<boolean> {
        if (!player.accountData || !player.accountData._id) {
            return false;
        }

        const newDocument: Character = deepCloneObject<Character>(CharacterDefaults);
        newDocument.account_id = player.accountData._id;
        newDocument.appearance = appearance;
        newDocument.info = info;
        newDocument.name = name;

        let document = await Athena.database.funcs.insertData<Character>(
            newDocument,
            Athena.database.collections.Characters,
            true,
        );

        if (!document) {
            return false;
        }

        const afterInjections = Injections.get<CharacterCreateCallback>(PlayerInjectionNames.AFTER_CHARACTER_CREATE);
        for (const callback of afterInjections) {
            const appendedDocumentOrVoid = await callback(player, document);
            if (appendedDocumentOrVoid) {
                document = appendedDocumentOrVoid;
            }
        }

        document._id = document._id.toString(); // Re-cast id object as string.
        CharacterSystem.select(player, document);
        return true;
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

        // Increase the value outright
        if (player.data.character_id === undefined || player.data.character_id === null) {
            await Global.increase('nextCharacterId', 1, 1);
            const nextCharacterID = await Global.getKey<number>('nextCharacterId');
            await Athena.state.set(player, 'character_id', nextCharacterID);
        }

        alt.log(
            `Selected | ${player.data.name} | ID: (${player.id}) | Character ID: ${player.data.character_id} | Account: ${player.data.account_id}`,
        );

        const beforeInjections = Injections.get<PlayerCallback>(PlayerInjectionNames.BEFORE_CHARACTER_SELECT);
        for (const callback of beforeInjections) {
            await callback(player);
        }

        Athena.player.sync.appearance(player, player.data.appearance as Appearance);

        if (!player.data.equipment) {
            await Athena.state.set(player, 'equipment', []);
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

            // Check if armour exists.
            if (player.data.armour) {
                Athena.player.safe.addArmour(player, player.data.armour, true);
            } else {
                Athena.player.safe.addArmour(player, 0, true);
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

            // Finish Selection
            Athena.player.set.frozen(player, false);
            player.visible = true;
            player.hasFullySpawned = true;

            const afterInjections = Injections.get<PlayerCallback>(PlayerInjectionNames.AFTER_CHARACTER_SELECT);
            for (const callback of afterInjections) {
                await callback(player);
            }

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
