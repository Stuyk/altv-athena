import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { ObjectId } from 'mongodb';

import * as Athena from '../api/index.js';
import { DEFAULT_CONFIG } from '../athena/main.js';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced.js';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { Character, CharacterDefaults } from '@AthenaShared/interfaces/character.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';
import { CharacterInfo } from '@AthenaShared/interfaces/characterInfo.js';

const Callbacks: { [key: string]: (player: alt.Player, ...args: any[]) => void } = {
    creator: null,
};

/**
 * Allows a custom character creator to be shown.
 *
 * @param {(player: alt.Player, ...args: any[]) => void} callback
 *
 */
export function setCreatorCallback(callback: (player: alt.Player, ...args: any[]) => void) {
    if (Overrides.setCreatorCallback) {
        return Overrides.setCreatorCallback(callback);
    }

    Callbacks.creator = callback;
}

/**
 * Invokes the custom creator to be opened.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {...any[]} args
 *
 */
export function invokeCreator(player: alt.Player, ...args: any[]) {
    if (Overrides.invokeCreator) {
        return Overrides.invokeCreator(player, ...args);
    }

    if (!Callbacks.creator) {
        alt.logWarning(`No Character Creator Setup in CharacterSystem. Use CharacterSystem.setCreatorCallback`);
        return;
    }

    Callbacks.creator(player, ...args);
}

/**
 * Create a new character for a specific player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Appearance} appearance
 * @param {CharacterInfo} info
 * @param {string} name
 * @return {Promise<boolean>}
 *
 */
export async function create(
    player: alt.Player,
    appearance: Appearance,
    info: CharacterInfo,
    name: string,
): Promise<boolean> {
    if (Overrides.create) {
        return await Overrides.create(player, appearance, info, name);
    }

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

    Athena.player.events.trigger('player-character-created', player);
    return true;
}

/**
 * The final step in the character selection system.
 *
 * After this step the player is spawned and synchronized.
 *
 * Always call this function last in login flow modifications.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Character} character
 *
 */
export async function select(player: alt.Player, character: Character) {
    if (Overrides.select) {
        return await Overrides.select(player, character);
    }

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

    Athena.player.sync.appearance(player);
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
        Athena.systems.inventory.weapons.update(player);
        player.frozen = false;
        player.visible = true;

        Athena.player.emit.fadeScreenFromBlack(player, 2000);
        Athena.player.events.trigger('selected-character', player);
        Athena.webview.emit(player, SYSTEM_EVENTS.PLAYER_EMIT_STATE, data);
    }, 500);
}

/**
 * Check if a character name is taken.
 *
 * @param {string} name
 * @return {Promise<boolean>}
 *
 */
export async function isNameTaken(name: string): Promise<boolean> {
    if (Overrides.isNameTaken) {
        return await Overrides.isNameTaken(name);
    }

    const result = await Database.fetchData<Character>('name', name, Athena.database.collections.Characters);
    return result ? true : false;
}

/**
 * Get all characters that belong to an account by account identifier.
 *
 * @param {string} account_id
 * @return {Promise<Array<Character>>}
 */
export async function getCharacters(account_id: string): Promise<Array<Character>> {
    if (Overrides.getCharacters) {
        return await Overrides.getCharacters(account_id);
    }

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
            firstLookup[i]._id = String(firstLookup[i]._id);
        }
    }

    // This converts all legacy ObjectID `account_id` into strings.
    if (secondLookup.length >= 1) {
        for (let i = 0; i < secondLookup.length; i++) {
            secondLookup[i]._id = String(secondLookup[i]._id);
            secondLookup[i].account_id = String(secondLookup[i].account_id);
            await Database.updatePartialData(
                secondLookup[i]._id,
                { account_id: secondLookup[i].account_id },
                Athena.database.collections.Characters,
            );
        }
    }

    return [...firstLookup, ...secondLookup];
}

interface CharacterFuncs {
    create: typeof create;
    setCreatorCallback: typeof setCreatorCallback;
    invokeCreator: typeof invokeCreator;
    select: typeof select;
    isNameTaken: typeof isNameTaken;
    getCharacters: typeof getCharacters;
}

const Overrides: Partial<CharacterFuncs> = {};

export function override(functionName: 'create', callback: typeof create);
export function override(functionName: 'setCreatorCallback', callback: typeof setCreatorCallback);
export function override(functionName: 'invokeCreator', callback: typeof invokeCreator);
export function override(functionName: 'select', callback: typeof select);
export function override(functionName: 'isNameTaken', callback: typeof isNameTaken);
export function override(functionName: 'getCharacters', callback: typeof getCharacters);

/**
 * Used to override character creation / management internally.
 *
 *
 * @param {keyof CharacterFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof CharacterFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
