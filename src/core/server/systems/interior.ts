import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER } from '../../shared/enums/AthenaEvents';
import { CurrencyTypes } from '../../shared/enums/Currency';

import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { INTERIOR_SYSTEM, INTERIOR_TYPES } from '../../shared/flags/InteriorFlags';
import { Character } from '../../shared/interfaces/Character';
import { Interior } from '../../shared/interfaces/Interior';
import { IObject } from '../../shared/interfaces/IObject';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import { InteriorInfo } from '../interface/InteriorInfo';
import Logger from '../utility/athenaLogger';
import { getMissingNumber } from '../utility/math';
import { InteractionController } from './interaction';
import { ServerMarkerController } from '../streamers/marker';
import { ServerObjectController } from '../streamers/object';
import { ServerTextLabelController } from '../streamers/textlabel';

import './storage';
import { StorageSystem } from './storage';
import { StorageView } from '../views/storage';
import { INTERIOR_RULES } from '../../shared/enums/InteriorRules';
import { IResponse } from '../../shared/interfaces/IResponse';
import SystemRules from './rules';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

const ONE_BILLION = 1000000000;
const PREFIX_HOUSE_TEXT_OUTSIDE = 'house-text-outside-';
const NEW_LINE = `~n~`;

let interiors: Array<InteriorInfo> = [];
let isReady = false;
let rules: { [key: string]: Array<(player: alt.Player, interior: Interior) => IResponse> } = {
    [INTERIOR_RULES.ENTER]: [],
    [INTERIOR_RULES.EXIT]: [],
    [INTERIOR_RULES.LOCK]: [],
    [INTERIOR_RULES.UNLOCK]: [],
};

export class InteriorSystem {
    /**
     * Fetch all interiors from the Database and populate cached data.
     * @static
     * @memberof InteriorSystem
     */
    static async init() {
        const currentInteriors = await Database.fetchAllData<Interior>(Collections.Interiors);

        if (!Array.isArray(currentInteriors)) {
            interiors = [];
        }

        for (let i = 0; i < currentInteriors.length; i++) {
            currentInteriors[i]._id = currentInteriors[i]._id.toString(); // Convert Interior IDs to String
            InteriorSystem.add(currentInteriors[i]);
        }

        isReady = true;

        // Only triggered when interior(s) list has nothing in it.
        if (interiors.length <= 0) {
            InteriorSystem.createDefaultInteriors();
        }
    }

    /**
     * Add a custom rule to interior events.
     * Extends existing functionality and allows for more rule checks before performing an event.
     *
     * @static
     * @param {INTERIOR_RULES} ruleType
     * @param {(player: alt.Player, interior: Interior) => IResponse} callback
     * @return {*}
     * @memberof InteriorSystem
     */
    static addCustomRule(ruleType: INTERIOR_RULES, callback: (player: alt.Player, interior: Interior) => IResponse) {
        if (!rules[ruleType]) {
            alt.logError(`${ruleType} does not exist for InteriorSystem Rules`);
            return;
        }

        rules[ruleType].push(callback);
    }

    /**
     * Needs to be a player.data._id;
     * @static
     * @param {string} ownerIdentifier
     * @memberof InteriorSystem
     */
    static getInteriorsByOwner(ownerIdentifier: string): Array<Interior> {
        return interiors.filter((x) => x.owners && x.owners[0] === ownerIdentifier);
    }

    static getNextID(): number {
        if (interiors.length <= 0) {
            return 1;
        }

        const values = interiors.map((interior) => {
            return interior.id;
        });

        // Start with index 1 because 0 is global dimension.
        return getMissingNumber(values, 1);
    }

    static async createDefaultInteriors() {
        // This only gets inserted into the database once.
        // Any additional changes have be removed / updated whatever.
        await InteriorSystem.create({
            name: 'Diamond Resorts Casino',
            outside: { x: 935.1909790039062, y: 46.17036819458008, z: 81.09584045410156 },
            inside: { x: 1089.8856201171875, y: 206.2451629638672, z: -49.5 },
            objects: [],
            system: INTERIOR_SYSTEM.NONE,
            type: INTERIOR_TYPES.SYSTEM,
        });

        // This is an example house.
        await InteriorSystem.create({
            name: 'Some Cool House',
            outside: { x: -841.6432495117188, y: -24.96125030517578, z: 40.39847183227539 },
            inside: new alt.Vector3(-786.8663, 315.7642, 217.6385),
            type: INTERIOR_TYPES.HOUSE,
            system:
                INTERIOR_SYSTEM.HAS_LOCK |
                INTERIOR_SYSTEM.HAS_OWNER |
                INTERIOR_SYSTEM.HAS_PRICE |
                INTERIOR_SYSTEM.HAS_STORAGE,
            ipl: 'apa_v_mp_h_01_a',
            price: 25000,
            isUnlocked: true,
        });
    }

    /**
     * Generates text to display outside based on interior properties.
     * Refreshes label if present.
     * @private
     * @static
     * @param {Interior} interior
     * @memberof InteriorSystem
     */
    private static refreshHouseText(interior: Interior): void {
        // Begin Outside Text Label Information
        let outsideName = '';

        outsideName += `${interior.name}`;
        outsideName += NEW_LINE;
        outsideName += `ID: ${interior.id}`;

        if (!interior.isUnlocked) {
            outsideName += NEW_LINE;
            outsideName += `~r~Locked~w~`;
        }

        if (interior.price >= 1) {
            outsideName += NEW_LINE;
            outsideName += `~g~Price: $${interior.price}~w~`;
        }

        const aboveGroundOutside = {
            x: interior.outside.x,
            y: interior.outside.y,
            z: interior.outside.z + 0.75,
        };

        ServerTextLabelController.remove(`${PREFIX_HOUSE_TEXT_OUTSIDE}${interior.id}`);
        ServerTextLabelController.append({
            uid: `${PREFIX_HOUSE_TEXT_OUTSIDE}${interior.id}`,
            pos: aboveGroundOutside,
            data: outsideName,
            maxDistance: 10,
        });
    }

    /**
     * Used to propogate interior cache data.
     * @private
     * @static
     * @param {Interior} interior
     * @memberof InteriorSystem
     */
    private static async add(interior: Interior) {
        const groundOutside = {
            x: interior.outside.x,
            y: interior.outside.y,
            z: interior.outside.z - 0.5,
        };

        const groundInside = {
            x: interior.inside.x,
            y: interior.inside.y,
            z: interior.inside.z - 0.5,
        };

        ServerMarkerController.append({
            uid: `house-marker-outside-${interior.id}`,
            maxDistance: 15,
            color: new alt.RGBA(255, 255, 0, 75),
            pos: groundOutside,
            scale: { x: 0.25, y: 0.25, z: 0.25 },
            type: 0,
        });

        const outsideColShape = InteractionController.add({
            description: `Open Interior Menu`,
            position: groundOutside,
            type: `interior`,
            identifier: `house-outside-${interior.id}`,
            data: [interior.id, true],
            callback: InteriorSystem.showMenu,
        });

        InteriorSystem.refreshHouseText(interior);

        interiors.push({
            ...interior,
            outsideShape: outsideColShape,
            insidePosition: groundInside,
            outsidePosition: groundOutside,
            ipl: interior.ipl,
            players: [],
            objects: interior.objects ? interior.objects : [],
        });
    }

    /**
     * Verify the interior object given is valid.
     * @static
     * @param {Interior} interior
     * @return {boolean}
     * @memberof InteriorSystem
     */
    static verifyInteriorData(interior: Interior): boolean {
        if (!interior.name) {
            console.error(new Error(`Interior did not have a name specified during creation.`));
            return false;
        }

        if (!interior.inside) {
            console.error(new Error(`Interior did not have an inside position specified during creation.`));
            return false;
        }

        if (!interior.outside) {
            console.error(new Error(`Interior did not have an outside position specified during creation.`));
            return false;
        }

        return true;
    }

    /**
     * Create a new interior.
     * @static
     * @memberof InteriorSystem
     */
    static async create(interior: Interior): Promise<Interior | null> {
        if (!isReady) {
            Logger.warning(`Interior creation is not ready. Try again later.`);
            return null;
        }

        if (!InteriorSystem.verifyInteriorData(interior)) {
            Logger.warning(`Interior data verification is invalid for`);
            return null;
        }

        if (!interior.ipl) {
            interior.ipl = null;
        }

        if (!interior.factions) {
            interior.factions = [];
        }

        if (!interior.owners) {
            interior.owners = [];
        }

        if (!interior.objects) {
            interior.objects = [];
        }

        // Auto generates the next ID or an ID to use for this interior.
        interior.id = InteriorSystem.getNextID();
        const newInterior = await Database.insertData<Interior>(interior, Collections.Interiors, true);
        if (!newInterior) {
            return null;
        }

        // Update the Array
        newInterior._id = newInterior._id.toString(); // Convert Interior ID to String
        await InteriorSystem.add(newInterior);

        Logger.log(`Created New Interior at ${newInterior.id.toString()} with name ${newInterior.name}`);
        return newInterior;
    }

    /**
     * Adds a faction to an interior.
     * @static
     * @param {string} id Interior Identifier
     * @param {string} faction
     * @return {*}
     * @memberof InteriorSystem
     */
    static async addFactionOwnership(id: string, faction: string): Promise<boolean> {
        const index = interiors.findIndex((ref) => `${ref.id}` === `${id}`);
        if (index <= -1) {
            return false;
        }

        if (!interiors[index].factions) {
            interiors[index].factions = [];
        }

        const existingFaction = interiors[index].factions.find((x) => x === faction);
        if (existingFaction) {
            return true;
        }

        interiors[index].factions.push(faction);
        await Database.updatePartialData(
            interiors[index]._id.toString(),
            { factions: interiors[index].factions },
            Collections.Interiors,
        );

        return true;
    }

    /**
     * Remove a faction from an interior.
     * @static
     * @param {string} id Interior Identifier
     * @param {string} faction
     * @return {*}
     * @memberof InteriorSystem
     */
    static async removeFactionOwnership(id: string, faction: string): Promise<boolean> {
        const index = interiors.findIndex((ref) => `${ref.id}` === `${id}`);
        if (index <= -1) {
            return false;
        }

        if (!interiors[index].factions) {
            interiors[index].factions = [];
        }

        const factionIndex = interiors[index].factions.findIndex((x) => x === faction);
        if (factionIndex <= -1) {
            return true;
        }

        interiors[index].factions.splice(factionIndex, 1);
        await Database.updatePartialData(
            interiors[index]._id.toString(),
            { factions: interiors[index].factions },
            Collections.Interiors,
        );

        return true;
    }

    /**
     * Refreshes an interior and for anyone inside of it.
     * @static
     * @param {string} id
     * @memberof InteriorSystem
     */
    static async refreshInteriorForPlayer(player: alt.Player) {
        if (!player || !player.valid || !player.data || player.data.interior === null) {
            return;
        }

        const interior = interiors.find((ref) => `${ref.id}` === `${player.data.interior}`);
        if (!interior) {
            return;
        }

        const objects = interior.objects;

        for (let i = 0; i < objects.length; i++) {
            ServerObjectController.removeFromPlayer(player, objects[i].uid, true);
        }

        // Reset Objects and Re-Add Them
        if (player.dimension === 0) {
            return;
        }

        for (let i = 0; i < objects.length; i++) {
            objects[i].isInterior = true;
            ServerObjectController.addToPlayer(player, objects[i]);
        }
    }

    /**
     * Add an object to an interior.
     * @static
     * @param {(string | number)} id
     * @param {IObject} objectData
     * @memberof InteriorSystem
     */
    static async addObject(id: string, objectData: IObject): Promise<string> {
        const interior = interiors.find((ref) => `${ref.id}` === `${id}`);
        if (!interior) {
            return null;
        }

        const index = interior.objects.findIndex((x) => x.uid === objectData.uid);
        if (index !== -1) {
            Logger.warning(`Please Use Unique Identifiers for Interior Objects. ${objectData.uid}`);
            objectData.uid = `${objectData.uid}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
        }

        interior.objects.push(objectData);
        await Database.updatePartialData(interior._id, { objects: interior.objects }, Collections.Interiors);

        interior.players.forEach((player) => {
            InteriorSystem.refreshInteriorForPlayer(player);
        });

        return objectData.uid;
    }

    /**
     * Remove an object from an interior.
     * @static
     * @param {(string | number)} id
     * @param {IObject} objectData
     * @memberof InteriorSystem
     */
    static async removeObject(id: string, uid: string) {
        const interior = interiors.find((ref) => `${ref.id}` === `${id}`);
        if (!interior) {
            return;
        }

        let wasModified = false;

        for (let i = interior.objects.length - 1; i >= 0; i--) {
            if (interior.objects[i].uid !== uid) {
                continue;
            }

            wasModified = true;
            interior.objects.splice(i, 1);
            break;
        }

        if (!wasModified) {
            return;
        }

        await Database.updatePartialData(interior._id, { objects: interior.objects }, Collections.Interiors);
        interior.players.forEach((player) => {
            InteriorSystem.refreshInteriorForPlayer(player);
        });
    }

    /**
     * Toggle a lock for the closest interior.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @memberof InteriorSystem
     */
    static async toggleLock(player: alt.Player, id: number) {
        if (!player || !player.valid || !player.data || player.data.isDead || !id) {
            return;
        }

        const index = interiors.findIndex((ref) => `${ref.id}` === `${id}`);
        if (index <= -1) {
            return;
        }

        const isFactionOwner = interiors[index].factions.find(
            (x) => player.data && player.data.faction && x === player.data.faction,
        );

        const isOwner = interiors[index].owners.find((x) => x === player.data._id.toString());

        if (!isFactionOwner && !isOwner) {
            return;
        }

        const ruleToCheck = interiors[index].isUnlocked ? INTERIOR_RULES.LOCK : INTERIOR_RULES.UNLOCK;

        // Check rules for unlocking / locking interior.
        if (!SystemRules.check(ruleToCheck, rules, player, interiors[index])) {
            return;
        }

        // Change Lock Status
        interiors[index].isUnlocked = !interiors[index].isUnlocked;
        InteriorSystem.refreshHouseText(interiors[index]);
        alt.emit(ATHENA_EVENTS_PLAYER.TOGGLED_INTERIOR_LOCK, player, id, interiors[index].isUnlocked);
        await Database.updatePartialData(
            interiors[index]._id,
            { isUnlocked: interiors[index].isUnlocked },
            Collections.Interiors,
        );
    }

    /**
     * Called when the player interacts with an outside interaction interior point.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @return {*}
     * @memberof InteriorSystem
     */
    static showMenu(player: alt.Player, id: number, isOutside: boolean = true) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        const interior = interiors.find((ref) => `${ref.id}` === `${id}`);
        if (!interior) {
            return;
        }

        const data = deepCloneObject<InteriorInfo>(interior);
        delete data.players;
        delete data.factions;
        delete data.storage;
        delete data.insideShape;
        delete data.outsideShape;
        delete data.ipl;

        alt.emitClient(player, SYSTEM_EVENTS.INTERIOR_SHOW_MENU, interior, isOutside);
    }

    /**
     * Called when a player is 'entering' an interior.
     * This can also be called when the player is logging in.
     * @static
     * @param {alt.Player} player
     * @memberof InteriorSystem
     */
    static async enter(player: alt.Player, id: number, doNotTeleport = false, skipDistanceCheck = false) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        const interior = interiors.find((ref) => `${ref.id}` === `${id}`);
        if (!interior) {
            return;
        }

        if (!skipDistanceCheck) {
            const dist = distance2d(player.pos, interior.outsidePosition);
            if (dist >= 5) {
                playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_TOO_FAR_FROM_ENTRANCE));
                return;
            }
        }

        if (isFlagEnabled(interior.system, INTERIOR_SYSTEM.HAS_LOCK) && !interior.isUnlocked) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_DOOR_LOCKED));
            return;
        }

        // Check rules for entering interior.
        if (!SystemRules.check(INTERIOR_RULES.ENTER, rules, player, interior)) {
            return;
        }

        if (!interior) {
            // Small case where an interior just no longer exists.
            if (doNotTeleport) {
                Logger.error(`Interior with ID: ${id} did not exist. Moved ${player.data.name} to spawn.`);
                playerFuncs.save.field(player, 'interior', null);
                playerFuncs.safe.setPosition(
                    player,
                    DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x,
                    DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y,
                    DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z,
                );
            }
            return;
        }

        if (!interior.insideShape) {
            interior.insideShape = InteractionController.add({
                description: `Open Interior Menu`,
                position: interior.insidePosition,
                type: `interior`,
                identifier: `house-inside-${id}`,
                data: [interior.id, false],
                callback: InteriorSystem.showMenu,
                dimension: id,
            });

            ServerMarkerController.append({
                uid: `house-marker-inside-${id}`,
                maxDistance: 15,
                color: new alt.RGBA(255, 255, 0, 75),
                pos: interior.insidePosition,
                type: 0,
                dimension: id,
                scale: { x: 0.25, y: 0.25, z: 0.5 },
            });
        }

        if (interior.ipl) {
            alt.emitClient(player, SYSTEM_EVENTS.IPL_LOAD, interior.ipl);
        }

        playerFuncs.safe.setDimension(player, id);

        // Added solely for synchronizing interior for player's who
        // logged out inside of an interior.
        if (!doNotTeleport) {
            playerFuncs.set.frozen(player, true);

            playerFuncs.safe.setPosition(
                player,
                interior.insidePosition.x,
                interior.insidePosition.y,
                interior.insidePosition.z,
            );

            // Freeze Player for Interior Loading
            alt.setTimeout(() => {
                playerFuncs.set.frozen(player, false);
            }, 1000);
        }

        // Check if the player exists already.
        const playerIndex = interior.players.findIndex((x) => x && x.valid && x.id == player.id);
        if (playerIndex <= -1) {
            interior.players.push(player);
        } else {
            interior.players[playerIndex] = player;
        }

        // Save Interior Info Here for Player
        player.data.interior = id;
        InteriorSystem.refreshInteriorForPlayer(player);
        playerFuncs.save.field(player, 'interior', id);
        alt.emit(ATHENA_EVENTS_PLAYER.ENTERED_INTERIOR, player, id);
    }

    /**
     * Called when a player is 'exiting' an interior.
     * @static
     * @param {alt.Player} player
     * @memberof InteriorSystem
     */
    static async exit(player: alt.Player, id: number) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        const interior = interiors.find((ref) => `${ref.id}` === `${id}`);
        if (!interior) {
            return;
        }

        const dist = distance2d(player.pos, interior.insidePosition);
        if (dist >= 5) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_TOO_FAR_FROM_EXIT));
            return;
        }

        // Check rules for exiting interior.
        if (!SystemRules.check(INTERIOR_RULES.EXIT, rules, player, interior)) {
            return;
        }

        playerFuncs.set.frozen(player, true);
        playerFuncs.safe.setDimension(player, 0);
        playerFuncs.safe.setPosition(
            player,
            interior.outsidePosition.x,
            interior.outsidePosition.y,
            interior.outsidePosition.z,
        );

        if (interior.ipl) {
            alt.emitClient(player, SYSTEM_EVENTS.IPL_UNLOAD, interior.ipl);
        }

        // Remove player from interior list if present.
        // Work through the array backwards to prevent issues when modifying.
        for (let i = interior.players.length - 1; i >= 0; i--) {
            const target = interior.players[i];
            if (!target || !target.valid) {
                interior.players.splice(i, 1);
                continue;
            }

            if (target.id !== player.id) {
                continue;
            }

            interior.players.splice(i, 1);
        }

        // Clear Interior Info for Player
        InteriorSystem.refreshInteriorForPlayer(player);
        player.data.interior = 0;
        playerFuncs.save.field(player, 'interior', null);
        alt.emit(ATHENA_EVENTS_PLAYER.LEFT_INTERIOR, player, id);

        alt.setTimeout(() => {
            if (!player || !player.valid) {
                return;
            }

            playerFuncs.set.frozen(player, false);
        }, 1000);
    }

    /**
     * Check if player has ownership of this interior.
     * @static
     * @param {alt.Player} player
     * @param {Interior} interior
     * @return {*}  {boolean}
     * @memberof InteriorSystem
     */
    static isOwner(player: alt.Player, interior: Interior): boolean {
        if (!player || !player.valid || player.data.isDead || !interior) {
            return false;
        }

        if (interior.owners[0] && interior.owners[0] === player.data._id.toString()) {
            return true;
        }

        return false;
    }

    /**
     * Purchase an interior from another player.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @return {*}
     * @memberof InteriorSystem
     */
    static async purchase(player: alt.Player, id: number) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        const index = interiors.findIndex((ref) => `${ref.id}` === `${id}`);
        if (index <= -1) {
            return;
        }

        const dist = distance2d(player.pos, interiors[index].outsidePosition);
        if (dist >= 5) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_TOO_FAR_FROM_ENTRANCE));
            return;
        }

        if (InteriorSystem.isOwner(player, interiors[index])) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (player.data.bank + player.data.cash < interiors[index].price) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_NOT_ENOUGH_CURRENCY));
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (!playerFuncs.currency.subAllCurrencies(player, interiors[index].price)) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_NOT_ENOUGH_CURRENCY));
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const originalOwner = interiors[index].owners[0];
        const originalPrice = interiors[index].price;

        interiors[index].owners = [player.data._id.toString()];
        interiors[index].factions = [];
        interiors[index].price = null;

        // Add Cash to Original Owner
        if (originalOwner) {
            const target = alt.Player.all.find((x) => x && x.data && x.data._id.toString() === originalOwner);

            if (target) {
                playerFuncs.currency.add(target, CurrencyTypes.BANK, originalPrice);
                playerFuncs.emit.sound2D(target, 'item_purchase');
                playerFuncs.emit.notification(
                    player,
                    LocaleController.get(LOCALE_KEYS.INTERIOR_SOLD, interiors[index].id, originalPrice),
                );
            } else {
                const targetData = await Database.fetchData<Character>(`_id`, originalOwner, Collections.Characters);
                targetData.bank += originalPrice;
                await Database.updatePartialData(originalOwner, { bank: targetData.bank }, Collections.Characters);
            }
        }

        await Database.updatePartialData(
            interiors[index]._id,
            {
                isUnlocked: interiors[index].isUnlocked,
                price: interiors[index].price,
                owners: interiors[index].owners,
                factions: interiors[index].factions,
            },
            Collections.Interiors,
        );

        InteriorSystem.refreshHouseText(interiors[index]);
        playerFuncs.emit.notification(
            player,
            LocaleController.get(LOCALE_KEYS.INTERIOR_PURCHASED, interiors[index].id, originalPrice),
        );
        playerFuncs.emit.sound2D(player, 'item_purchase');
    }

    /**
     * Set the name of the interior. Requires Ownership.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @param {string} name
     * @return {*}
     * @memberof InteriorSystem
     */
    static async setName(player: alt.Player, id: number, name: string) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        if (name.length >= 24) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const index = interiors.findIndex((ref) => `${ref.id}` === `${id}`);
        if (index <= -1) {
            return;
        }

        const dist = distance2d(player.pos, interiors[index].outsidePosition);
        if (dist >= 5) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_TOO_FAR_FROM_ENTRANCE));
            return;
        }

        if (!InteriorSystem.isOwner(player, interiors[index])) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        interiors[index].name = name;
        await Database.updatePartialData(
            interiors[index]._id,
            {
                name: interiors[index].name,
            },
            Collections.Interiors,
        );

        InteriorSystem.refreshHouseText(interiors[index]);
        playerFuncs.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }

    /**
     * Set the sale price of an interior. Requires ownership.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @param {(string | number)} value
     * @return {*}
     * @memberof InteriorSystem
     */
    static async setPrice(player: alt.Player, id: number, value: number) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        if (isNaN(value)) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (value > ONE_BILLION) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const index = interiors.findIndex((ref) => `${ref.id}` === `${id}`);
        if (index <= -1) {
            return;
        }

        if (!InteriorSystem.isOwner(player, interiors[index])) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const dist = distance2d(player.pos, interiors[index].outsidePosition);
        if (dist >= 5) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_TOO_FAR_FROM_ENTRANCE));
            return;
        }

        if (value <= -1) {
            interiors[index].price = null;
        } else {
            value = Math.abs(Math.floor(value));
            interiors[index].price = value;
        }

        await Database.updatePartialData(
            interiors[index]._id,
            {
                price: interiors[index].price,
            },
            Collections.Interiors,
        );

        InteriorSystem.refreshHouseText(interiors[index]);
        playerFuncs.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }

    /**
     * Open storage for the interior. If allowed.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @return {*}
     * @memberof InteriorSystem
     */
    static async storage(player: alt.Player, id: number) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        const index = interiors.findIndex((ref) => `${ref.id}` === `${id}`);
        if (index <= -1) {
            return;
        }

        if (!InteriorSystem.isOwner(player, interiors[index])) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (!isFlagEnabled(interiors[index].system, INTERIOR_SYSTEM.HAS_STORAGE)) {
            playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.INTERIOR_NO_STORAGE));
            return;
        }

        let storageID: string;

        // Remove array. Make it a string reference to the storage box.
        if (!interiors[index].storage || Array.isArray(interiors[index].storage)) {
            const storage = await StorageSystem.create({ cash: 0, items: [], maxSize: 28 });
            storageID = storage._id.toString();
            interiors[index].storage = storageID;
            await Database.updatePartialData(interiors[index]._id, { storage: storageID }, Collections.Interiors);
        } else {
            storageID = interiors[index].storage;
        }

        StorageView.open(player, storageID, `Interior - ${interiors[index].id} - Storage`);
    }
}

alt.onClient(SYSTEM_EVENTS.INTERIOR_TOGGLE_LOCK, InteriorSystem.toggleLock);
alt.onClient(SYSTEM_EVENTS.INTERIOR_ENTER, InteriorSystem.enter);
alt.onClient(SYSTEM_EVENTS.INTERIOR_EXIT, InteriorSystem.exit);
alt.onClient(SYSTEM_EVENTS.INTERIOR_PURCHASE, InteriorSystem.purchase);
alt.onClient(SYSTEM_EVENTS.INTERIOR_SET_NAME, InteriorSystem.setName);
alt.onClient(SYSTEM_EVENTS.INTERIOR_SET_PRICE, InteriorSystem.setPrice);
alt.onClient(SYSTEM_EVENTS.INTERIOR_STORAGE, InteriorSystem.storage);

InteriorSystem.init();
