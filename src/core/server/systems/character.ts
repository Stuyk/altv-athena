import * as alt from 'alt-server';
import * as Athena from '../api';
import Database from '@stuyk/ezmongodb';
import { DEFAULT_CONFIG } from '../athena/main';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Character, CharacterDefaults } from '@AthenaShared/interfaces/character';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { Injections } from './injections';
import { Appearance } from '@AthenaShared/interfaces/appearance';
import { CharacterInfo } from '@AthenaShared/interfaces/characterInfo';
import { ObjectId } from 'mongodb';

const Callbacks: { [key: string]: (player: alt.Player, ...args: any[]) => void } = {
    creator: null,
};

/**
 * Allows a custom character creator to be shown.
 *
 * @static
 * @param {(player: alt.Player, ...args: any[]) => void} callback
 * @memberof CharacterSystem
 */
export function setCreatorCallback(callback: (player: alt.Player, ...args: any[]) => void) {
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
export function invokeCreator(player: alt.Player, ...args: any[]) {
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
export async function create(
    player: alt.Player,
    appearance: Appearance,
    info: CharacterInfo,
    name: string,
): Promise<boolean> {
    const accountData = Athena.document.account.get(player);
    if (!accountData || !accountData._id) {
        return false;
    }

    const newDocument: Character = deepCloneObject<Character>(CharacterDefaults);
    newDocument.account_id = accountData._id;
    newDocument.appearance = appearance;
    newDocument.info = info;
    newDocument.name = name;

    let document = await Database.insertData<Character>(newDocument, Athena.database.collections.Characters, true);

    if (!document) {
        return false;
    }

    document._id = document._id.toString(); // Re-cast id object as string.
    select(player, document);
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
export async function select(player: alt.Player, character: Character) {
    if (!player || !player.valid) {
        return;
    }

    const data = deepCloneObject<Character>(character);
    Athena.document.character.bind(player, data);

    // Increase the value outright
    if (data.character_id === undefined || data.character_id === null) {
        await Athena.systems.global.increase('nextCharacterId', 1, 1);
        const nextCharacterID = await Athena.systems.global.getKey<number>('nextCharacterId');
        await Athena.document.character.set(player, 'character_id', nextCharacterID);
    }

    alt.log(
        `Selected | ${data.name} | ID: (${player.id}) | Character ID: ${data.character_id} | Account: ${data.account_id}`,
    );

    if (!data.inventory) {
        await Athena.document.character.set(player, 'equipment', []);
    }

    if (!data.toolbar) {
        await Athena.document.character.set(player, 'toolbar', []);
    }

    Athena.player.sync.appearance(player, data.appearance as Appearance);
    Athena.systems.inventory.clothing.update(player);

    alt.emitClient(player, SYSTEM_EVENTS.TICKS_START);

    // Set player dimension to zero.
    Athena.player.safe.setDimension(player, 0);
    player.frozen = true;

    if (data.dimension) {
        Athena.player.safe.setDimension(player, data.dimension);
        Athena.player.emit.message(player, `Dimension: ${data.dimension}`);
    }

    alt.setTimeout(async () => {
        if (!player || !player.valid) {
            return;
        }

        if (data.pos) {
            Athena.player.safe.setPosition(player, data.pos.x, data.pos.y, data.pos.z);
        } else {
            Athena.player.safe.setPosition(
                player,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y,
                DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z,
            );
        }

        // Check if health exists.
        if (data.health) {
            Athena.player.safe.addHealth(player, data.health, true);
        } else {
            Athena.player.safe.addHealth(player, 200, true);
        }

        // Check if armour exists.
        if (data.armour) {
            Athena.player.safe.addArmour(player, data.armour, true);
        } else {
            Athena.player.safe.addArmour(player, 0, true);
        }

        // Synchronization
        Athena.player.sync.currencyData(player);

        player.setSyncedMeta(PLAYER_SYNCED_META.NAME, data.name);
        player.setSyncedMeta(PLAYER_SYNCED_META.PING, player.ping);
        player.setSyncedMeta(PLAYER_SYNCED_META.POSITION, player.pos);
        player.setSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID, data._id.toString());

        // Propagation
        // Athena.controllers.chat.populateCommands(player);
        Athena.controllers.blip.populateGlobalBlips(player);

        // Vehicle Spawning
        if (!DEFAULT_CONFIG.SPAWN_ALL_VEHICLES_ON_START && DEFAULT_CONFIG.SPAWN_VEHICLES_ON_JOIN) {
            // const vehicles = await Athena.vehicle.funcs.getPlayerVehicles(data._id);
            // Athena.vehicle.funcs.spawnPlayerVehicles(vehicles);
        }

        // Finish Selection
        Athena.systems.inventory.weapons.update(player);
        player.frozen = false;
        player.visible = true;
        player.hasFullySpawned = true;

        Athena.player.events.trigger('selected-character', player);
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
export async function isNameTaken(name: string): Promise<boolean> {
    const result = await Database.fetchData<Character>('name', name, Athena.database.collections.Characters);
    return result ? true : false;
}

/**
 * Get all characters that belong to an account.
 *
 * @param {string} account_id player.accountData._id.toString()
 * @return {Promise<Array<Character>>}
 */
export async function getCharacters(account_id: string): Promise<Array<Character>> {
    const firstLookup = await Database.fetchAllByField<Character>(
        'account_id',
        account_id,
        Athena.database.collections.Characters,
    );

    const secondLookup = await Database.fetchAllByField<Character>(
        'account_id',
        new ObjectId(account_id),
        Athena.database.collections.Characters,
    );

    if (firstLookup.length >= 1) {
        for (let i = 0; i < firstLookup.length; i++) {
            firstLookup[i]._id = firstLookup[i]._id.toString();
        }
    }

    // This converts all legacy ObjectID `account_id` into strings.
    if (secondLookup.length >= 1) {
        for (let i = 0; i < secondLookup.length; i++) {
            secondLookup[i]._id = secondLookup[i]._id.toString();
            secondLookup[i].account_id = secondLookup[i].account_id.toString();
            await Database.updatePartialData(
                secondLookup[i]._id,
                { account_id: secondLookup[i].account_id },
                Athena.database.collections.Characters,
            );
        }
    }

    return [...firstLookup, ...secondLookup];
}
