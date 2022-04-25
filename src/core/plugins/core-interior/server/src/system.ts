import * as alt from 'alt-server';

// Yes; there needs to be this many imports to get this working.
import './player';
import './cmds';

import { Interior } from '../../shared/interfaces';
import Database from '@stuyk/ezmongodb';
import { sha256Random } from '../../../../server/utility/encryption';
import { InteriorInternal } from './interfaces';
import { ServerMarkerController } from '../../../../server/streamers/marker';
import { InteractionController } from '../../../../server/systems/interaction';
import { distance } from '../../../../shared/utility/vector';
import { isFlagEnabled } from '../../../../shared/utility/flags';
import { INTERIOR_SYSTEM } from '../../shared/flags';
import SystemRules from '../../../../server/systems/rules';
import { IResponse } from '../../../../shared/interfaces/iResponse';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { ServerObjectController } from '../../../../server/streamers/object';
import { ServerTextLabelController } from '../../../../server/streamers/textlabel';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { Character } from '../../../../shared/interfaces/character';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { StorageView } from '../../../../server/views/storage';
import { StorageSystem } from '../../../../server/systems/storage';
import { INTERIOR_COLLECTIONS, INTERIOR_INTERACTIONS, INTERIOR_RULES } from '../../shared/enums';
import { IObject } from '../../../../shared/interfaces/iObject';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { LOCALE_INTERIOR_VIEW } from '../../shared/locales';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { Athena } from '../../../../server/api/athena';

/**
 * Interiors should work in the following way.
 * You provide a 'uid' to the interior for removal / adding.
 * However, if one is not provided we simply create a uid for the interior.
 * Everything should work around the uid for adding, looking up, etc.
 */
const ONE_BILLION = 1000000000;
const DOOR_CHECK_DIST = 3;
const LOST_PLAYER_POS = { x: -867.1437377929688, y: -172.6201934814453, z: 37.799232482910156 };
const NEW_LINE = `~n~`;
const INTERACTION_DISTANCE = 2;
const interiors: Map<string, InteriorInternal> = new Map();

let nextDimension = 2;
let isInitializing = true;
let rules: { [key: string]: Array<(player: alt.Player, interior: Interior) => IResponse> } = {
    [INTERIOR_RULES.ENTER]: [],
    [INTERIOR_RULES.EXIT]: [],
    [INTERIOR_RULES.LOCK]: [],
    [INTERIOR_RULES.UNLOCK]: [],
};

// Do not export; meant to be internal only.
class InternalSystem {
    /**
     * Creates an interior in-game that can be interacted with;
     * this does not insert it into the database and should only be called via InteriorSystem.
     *
     * @static
     * @param {Interior} interior
     * @memberof InternalSystem
     */
    static create(interior: Interior) {
        const interiorInfo: InteriorInternal = {
            ...interior,
            dimension: nextDimension,
        };

        // Increment dimension for next interior added.
        nextDimension += 1;

        interiorInfo._id = interiorInfo._id.toString();

        if (!interior.removeOutsideColshape) {
            ServerMarkerController.append({
                uid: `${interior.uid}-outside`,
                maxDistance: 15,
                color: new alt.RGBA(255, 255, 0, 75),
                pos: interior.outside,
                scale: { x: 0.25, y: 0.25, z: 0.25 },
                type: 0,
            });

            const outsideUid = InteractionController.add({
                description: LOCALE_INTERIOR_VIEW.LABEL_OPEN_INTERIOR_MENU,
                position: interior.outside,
                uid: `${interior.uid}-outside`,
                data: [interior.uid, true],
                range: INTERACTION_DISTANCE,
                callback: InteriorSystem.showMenu,
                isPlayerOnly: true,
            });

            interiorInfo.outsideShape = InteractionController.get(outsideUid);
        }

        InternalSystem.refreshInteriorText(interiorInfo);
        interiors.set(interior.uid, interiorInfo);
    }

    /**
     * A way to wait for initial interiors to load from database
     * before attempting to add or remove any of them.
     * @static
     * @return {Promise<void>}
     * @memberof InternalSystem
     */
    static hasInitialized(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (isInitializing) {
                    return;
                }

                resolve();
                alt.clearInterval(interval);
            }, 100);
        });
    }

    /**
     * Remove a player identifier from an interior.
     * Requires the player to be inside of an interior.
     * @static
     * @param {alt.Player} player
     * @memberof InternalSystem
     */
    static removePlayer(player: alt.Player, interior: InteriorInternal = null) {
        if (!player || !player.valid) {
            return;
        }

        const id = player.id;
        const data = player.data;

        if (!data) {
            return;
        }

        interior = data.interior ? interiors.get(data.interior) : interior;
        if (!interior) {
            return;
        }

        if (!interior.players) {
            return;
        }

        const index = interior.players.findIndex((x) => x === id);
        if (index <= -1) {
            return;
        }

        interior.players.splice(index, 1);
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

        const interior = interiors.get(player.data.interior);
        if (!interior) {
            return;
        }

        if (!interior.objects) {
            interior.objects = [];
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
     * Generates text to display outside based on interior properties.
     * Refreshes label if present.
     * @private
     * @static
     * @param {Interior} interior
     * @memberof InternalSystem
     */
    static refreshInteriorText(interior: InteriorInternal): void {
        // Begin Outside Text Label Information
        let outsideName = '';

        outsideName += `${interior.name}`;

        if (!interior.isUnlocked) {
            outsideName += NEW_LINE;
            outsideName += `~r~${LOCALE_INTERIOR_VIEW.LABEL_LOCKED}~w~`;
        }

        if (interior.price >= 1) {
            outsideName += NEW_LINE;
            outsideName += `~g~${LOCALE_INTERIOR_VIEW.LABEL_PRICE}: $${interior.price}~w~`;
        }

        const aboveGroundOutside = {
            x: interior.outside.x,
            y: interior.outside.y,
            z: interior.outside.z + 0.75,
        };

        ServerTextLabelController.remove(`${interior.uid}-outside`);
        if (interior.removeTextLabel) {
            return;
        }

        ServerTextLabelController.append({
            uid: `${interior.uid}-outside`,
            pos: aboveGroundOutside,
            data: outsideName,
            maxDistance: 10,
        });
    }

    /**
     * Toggle a lock for the closest interior.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @memberof InteriorSystem
     */
    static async toggleLock(player: alt.Player, uid: string, skipOwnerCheck = false) {
        if (!player || !player.valid || !player.data || player.data.isDead || !uid) {
            return;
        }

        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        if (!skipOwnerCheck) {
            const hasAccess = await InteriorSystem.hasAccess(player, interior);
            if (!hasAccess) {
                console.log('no access get fucked bing bong');
                return;
            }
        }

        const ruleToCheck = interior.isUnlocked ? INTERIOR_RULES.LOCK : INTERIOR_RULES.UNLOCK;

        // Check rules for unlocking / locking interior.
        if (!SystemRules.check(ruleToCheck, rules, player, interior)) {
            return;
        }

        // Change Lock Status
        interior.isUnlocked = !interior.isUnlocked;
        InternalSystem.refreshInteriorText(interior);
        await Database.updatePartialData(interior._id, { isUnlocked: interior.isUnlocked }, INTERIOR_COLLECTIONS.CORE);
    }

    /**
     * Set the name of the interior. Requires Ownership.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @param {string} name
     * @return {*}
     * @memberof InteriorSystem
     */
    static async setName(
        player: alt.Player,
        uid: string,
        name: string,
        skipDistanceCheck = false,
        skipOwnerCheck = false,
    ) {
        if (!player || !player.valid || player.data.isDead || !uid) {
            return;
        }

        if (name.length >= 24) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        if (!skipDistanceCheck) {
            const dist = distance(player.pos, interior.outside);
            if (dist >= 5) {
                Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_TOO_FAR);
                return;
            }
        }

        if (skipOwnerCheck) {
            if (!InteriorSystem.isOwner(player, interior)) {
                Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_NO_KEYS);
                Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
        }

        interior.name = name;
        await Database.updatePartialData(
            interior._id,
            {
                name: interior.name,
            },
            INTERIOR_COLLECTIONS.CORE,
        );

        InternalSystem.refreshInteriorText(interior);
        Athena.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
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
    static async setPrice(
        player: alt.Player,
        uid: string,
        value: number,
        skipDistanceCheck = false,
        skipOwnerCheck = false,
    ) {
        if (!player || !player.valid || player.data.isDead || !uid) {
            return;
        }

        if (isNaN(value)) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (value > ONE_BILLION) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        if (!skipOwnerCheck) {
            if (!InteriorSystem.isOwner(player, interior)) {
                Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_NO_KEYS);
                Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
        }

        if (!skipDistanceCheck) {
            const dist = distance(player.pos, interior.outside);
            if (dist >= 5) {
                Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_TOO_FAR);
                return;
            }
        }

        if (value <= -1) {
            interior.price = null;
        } else {
            value = Math.abs(Math.floor(value));
            interior.price = value;
        }

        await Database.updatePartialData(
            interior._id,
            {
                price: interior.price,
            },
            INTERIOR_COLLECTIONS.CORE,
        );

        InternalSystem.refreshInteriorText(interior);
        Athena.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }

    /**
     * Open and display storage for an interior.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @return {*}
     * @memberof InternalSystem
     */
    static async storage(player: alt.Player, uid: string) {
        if (!player || !player.valid || player.data.isDead || !uid) {
            return;
        }

        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        if (!InteriorSystem.isOwner(player, interior)) {
            Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_NO_KEYS);
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (!isFlagEnabled(interior.system, INTERIOR_SYSTEM.HAS_STORAGE)) {
            Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_NO_STORAGE);
            return;
        }

        let storageID: string;

        // Remove array. Make it a string reference to the storage box.
        if (!interior.storage || Array.isArray(interior.storage)) {
            const storage = await StorageSystem.create({ cash: 0, items: [], maxSize: 28 });
            storageID = storage._id.toString();
            interior.storage = storageID;
            await Database.updatePartialData(interior._id, { storage: storageID }, INTERIOR_COLLECTIONS.CORE);
        } else {
            storageID = interior.storage;
        }

        StorageView.open(player, storageID, `Interior - ${interior.uid} - Storage`);
    }

    /**
     * Purchase an interior from another player.
     * @static
     * @param {alt.Player} player
     * @param {number} id
     * @return {*}
     * @memberof InteriorSystem
     */
    static async purchase(player: alt.Player, uid: string, skipDistanceCheck = false, skipOwnerCheck = false) {
        if (!player || !player.valid || player.data.isDead || !uid) {
            return;
        }

        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        if (!skipDistanceCheck) {
            const dist = distance(player.pos, interior.outside);
            if (dist >= 5) {
                Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_TOO_FAR);
                return;
            }
        }

        if (!skipOwnerCheck) {
            if (InteriorSystem.isOwner(player, interior)) {
                Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
                return;
            }
        }

        if (player.data.bank + player.data.cash < interior.price) {
            Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_NOT_ENOUGH_CURRENCY);
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        if (!Athena.player.currency.subAllCurrencies(player, interior.price)) {
            Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_NOT_ENOUGH_CURRENCY);
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return;
        }

        const originalOwner = interior.owner;
        const originalPrice = interior.price;

        interior.owner = player.data._id.toString();
        interior.factions = [];
        interior.keys = [];
        interior.price = null;

        // Add Cash to Original Owner
        if (originalOwner) {
            const target = alt.Player.all.find((x) => x && x.data && x.data._id.toString() === originalOwner);

            if (target) {
                Athena.player.currency.add(target, CurrencyTypes.BANK, originalPrice);
                Athena.player.emit.sound2D(target, 'item_purchase');
                Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_DID_SELL_INTERIOR);
            } else {
                const targetData = await Database.fetchData<Character>(`_id`, originalOwner, Collections.Characters);
                targetData.bank += originalPrice;
                await Database.updatePartialData(originalOwner, { bank: targetData.bank }, Collections.Characters);
            }
        }

        await Database.updatePartialData(
            interior._id,
            {
                isUnlocked: interior.isUnlocked,
                price: interior.price,
                owner: interior.owner,
                keys: interior.keys,
                factions: interior.factions,
            },
            INTERIOR_COLLECTIONS.CORE,
        );

        Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_DID_PURCHASE_INTERIOR);
        Athena.player.emit.sound2D(player, 'item_purchase');

        InteriorSystem.refresh(interior.uid);
    }

    /**
     * Spawn the player an interior if they were in an interior before.
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof InternalSystem
     */
    static spawn(player: alt.Player) {
        if (!player || !player.data || !player.valid) {
            return;
        }

        // Force the player into the interior they were last in.
        if (player.data.interior) {
            InteriorSystem.movePlayerIn(player, player.data.interior, true, true);
        }
    }
}

export class InteriorSystem {
    /**
     * Initialize and pull interiors from the Database
     * @static
     * @return {*}
     * @memberof InteriorSystem
     */
    static async init() {
        await Database.createCollection(INTERIOR_COLLECTIONS.CORE);
        const entries = await Database.fetchAllData<Interior>(INTERIOR_COLLECTIONS.CORE);

        if (entries.length <= 0) {
            isInitializing = false;
            return;
        }

        for (let i = 0; i < entries.length; i++) {
            await InternalSystem.create(entries[i]);
        }

        isInitializing = false;
    }

    /**
     * Add an interior to the database and system.
     * @static
     * @param {Interior} interior
     * @memberof InteriorSystem
     */
    static async add(interior: Interior): Promise<string | null> {
        await InternalSystem.hasInitialized();

        if (!interior.uid) {
            interior.uid = sha256Random(JSON.stringify(interior));
        }

        if (interiors.has(interior.uid)) {
            return null;
        }

        alt.log(`~g~Created Default Interior: ${interior.uid}`);
        const document = await Database.insertData<Interior>(interior, INTERIOR_COLLECTIONS.CORE, true);
        InternalSystem.create(document);
        return interior.uid;
    }

    /**
     * Get an interior based on uid.
     * @static
     * @param {string} uid
     * @return {Promise<Interior>}
     * @memberof InteriorSystem
     */
    static async get(uid: string): Promise<InteriorInternal> {
        await InternalSystem.hasInitialized();

        if (!interiors.has(uid)) {
            return null;
        }

        return interiors.get(uid);
    }

    /**
     * Remove an interior from the database and system.
     * @static
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async remove(uid: string): Promise<boolean> {
        await InternalSystem.hasInitialized();

        const interior = interiors.get(uid);
        if (!interior) {
            return false;
        }

        // Remove players inside interior if inside.
        if (interior.players.length >= 1) {
            const foundPlayers = alt.Player.all.filter((p) => interior.players.findIndex((ip) => ip === p.id) >= 0);
            for (let i = 0; i < foundPlayers.length; i++) {
                const target = foundPlayers[i];
                if (!target || !target.valid) {
                    continue;
                }

                InteriorSystem.movePlayerOut(target, true);
            }
        }

        // Delete colshapes, objects, etc.
        try {
            ServerMarkerController.remove(`${interior.uid}-outside`);
            ServerMarkerController.remove(`${interior.uid}-inside`);

            interior.outsideShape.destroy();
            interior.insideShape.destroy();
        } catch (err) {}

        await Database.deleteById(interior._id.toString(), INTERIOR_COLLECTIONS.CORE);
        return interiors.delete(uid);
    }

    static async movePlayerIn(
        player: alt.Player,
        uid: string,
        noTeleport = false,
        skipDistanceCheck = false,
    ): Promise<boolean> {
        const interior = await InteriorSystem.get(uid);

        // Interior does not exist. Ignore request.
        if (!interior) {
            return false;
        }

        if (!skipDistanceCheck) {
            const dist = distance(player.pos, interior.outside);
            if (dist > DOOR_CHECK_DIST) {
                Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_TOO_FAR);
                return false;
            }
        }

        if (isFlagEnabled(interior.system, INTERIOR_SYSTEM.HAS_LOCK) && !interior.isUnlocked) {
            Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_DOOR_IS_LOCKED);
            return false;
        }

        // Check rules for entering interior.
        if (!SystemRules.check(INTERIOR_RULES.ENTER, rules, player, interior)) {
            return false;
        }

        // Create inside interaction point.
        // Only creates it once for the single dimension since it does not exist yet.
        // Lowers need for additional interaction controllers.
        if (!interior.insideShape) {
            const insideUid = InteractionController.add({
                description: LOCALE_INTERIOR_VIEW.LABEL_OPEN_INTERIOR_MENU,
                position: interior.inside,
                uid: `${interior.uid}-inside`,
                data: [interior.uid, false],
                range: INTERACTION_DISTANCE,
                callback: InteriorSystem.showMenu,
                dimension: interior.dimension,
                isPlayerOnly: true,
            });

            interior.insideShape = InteractionController.get(insideUid);

            ServerMarkerController.append({
                uid: `${interior.uid}-inside`,
                maxDistance: 15,
                color: new alt.RGBA(255, 255, 0, 75),
                pos: interior.inside,
                type: 0,
                scale: { x: 0.25, y: 0.25, z: 0.5 },
                dimension: interior.dimension,
            });
        }

        if (interior.ipl) {
            alt.emitClient(player, SYSTEM_EVENTS.IPL_LOAD, interior.ipl);
        }

        Athena.player.safe.setDimension(player, interior.dimension);

        // Added solely for synchronizing interior for player's who
        // logged out inside of an interior.
        if (!noTeleport) {
            Athena.player.set.frozen(player, true);
            Athena.player.safe.setPosition(player, interior.inside.x, interior.inside.y, interior.inside.z + 1);

            // Freeze Player for Interior Loading
            alt.setTimeout(() => {
                Athena.player.set.frozen(player, false);
            }, 1000);
        }

        player.data.interior = interior.uid;
        Athena.player.save.field(player, 'interior', player.data.interior);
        InternalSystem.refreshInteriorForPlayer(player);
        return true;
    }

    /**
     * Move a player out of the interior.
     * If the player is not signed an interior they are sent to the lost player position.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async movePlayerOut(player: alt.Player, skipDistanceCheck = false): Promise<boolean> {
        const interior = await InteriorSystem.get(player.data.interior);

        if (!interior) {
            Athena.player.safe.setDimension(player, 0);
            Athena.player.safe.setPosition(player, LOST_PLAYER_POS.x, LOST_PLAYER_POS.y, LOST_PLAYER_POS.z);
            return false;
        }

        if (interior.ipl) {
            alt.emitClient(player, SYSTEM_EVENTS.IPL_UNLOAD, interior.ipl);
        }

        const dist = distance(player.pos, interior.inside);
        if (dist > DOOR_CHECK_DIST) {
            Athena.player.emit.notification(player, LOCALE_INTERIOR_VIEW.LABEL_TOO_FAR);
            return false;
        }

        if (!SystemRules.check(INTERIOR_RULES.EXIT, rules, player, interior)) {
            return false;
        }

        InternalSystem.removePlayer(player, interior);
        InternalSystem.refreshInteriorForPlayer(player);

        Athena.player.set.frozen(player, true);
        Athena.player.safe.setDimension(player, 0);
        Athena.player.safe.setPosition(player, interior.outside.x, interior.outside.y, interior.outside.z + 1);
        player.data.interior = null;
        Athena.player.save.field(player, 'interior', player.data.interior);
        alt.setTimeout(() => {
            if (!player || !player.valid) {
                return;
            }

            Athena.player.set.frozen(player, false);
        }, 1000);

        return true;
    }

    /**
     * Used for checking if a player is an owner of an interior.
     * @static
     * @param {alt.Player} player
     * @param {Interior} interior
     * @return {boolean}
     * @memberof InteriorSystem
     */
    static isOwner(player: alt.Player, interior: Interior): boolean {
        if (!player || !player.valid || player.data.isDead || !interior) {
            return false;
        }

        if (player.data._id.toString() === interior.owner) {
            return true;
        }

        return false;
    }

    /**
     * Returns a new key 'string' that can be appended to an item.
     * That item can be used for 'acccess' to this interior.
     *
     * Example Item:
     * ```
     * {
     *  name: "House 1",
     *  icon: "Key",
     *  data: {
     *    key: "jkfdjklsflksd"
     *  }
     * }
     * ```
     *
     * @static
     * @param {string} uid
     * @param {string} uniqueKey
     * @memberof InteriorSystem
     */
    static async addKeyAccess(item: { data: { key: string } }): Promise<string | null> {
        if (!item || !item.data || !item.data.key) {
            return null;
        }

        const interior = await InteriorSystem.get(item.data.key);
        if (!interior) {
            return null;
        }

        const accessKey = sha256Random(JSON.stringify(interior));

        if (!interior.keys) {
            interior.keys = [];
        }

        interior.keys.push(accessKey);
        await Database.updatePartialData(interior._id, { keys: interior.keys }, INTERIOR_COLLECTIONS.CORE);
        return accessKey;
    }

    /**
     * A unique key identifier for a locked interior.
     *
     * @static
     * @param {Interior} interior
     * @param {string} key
     * @return {*}  {boolean}
     * @memberof InteriorSystem
     */
    static hasKeyAccess(interior: Interior, key: string): boolean {
        if (interior.keys && interior.keys.findIndex((uid) => uid === key) >= 0) {
            return true;
        }

        return false;
    }

    /**
     * Used for locking / unlocking an interior.
     * @static
     * @param {alt.Player} player
     * @param {Interior} interior
     * @return {boolean}
     * @memberof InteriorSystem
     */
    static hasAccess(player: alt.Player, interior: Interior): boolean {
        if (!player || !player.valid || player.data.isDead || !interior) {
            return false;
        }

        const hasFactionSupport = interior.factions && player.data.faction;
        if (hasFactionSupport && interior.factions.findIndex((id) => id === player.data.faction) >= 0) {
            return true;
        }

        if (player.data._id.toString() === interior.owner) {
            return true;
        }

        if (interior.keys) {
            for (let i = 0; i < interior.keys.length; i++) {
                const isValidKey = Athena.player.inventory.checkForKeyValuePair(player, 'key', interior.keys);
                if (!isValidKey) {
                    continue;
                }

                return true;
            }
        }

        return false;
    }

    /**
     * Refresh interior text.
     * Pass a player to refresh objects as well.
     * @static
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async refresh(uid: string, player: alt.Player = null) {
        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        InternalSystem.refreshInteriorText(interior);

        if (player && player.valid) {
            InternalSystem.refreshInteriorForPlayer(player);
        }
    }

    /**
     * Usually called internally to show a menu to the player.
     * This menu is called through the interaction controller.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @param {boolean} [isOutside=true]
     * @return {*}
     * @memberof InteriorSystem
     */
    static async showMenu(player: alt.Player, uid: string, isOutside: boolean = true) {
        if (!player || !player.valid || player.data.isDead || !uid) {
            return;
        }

        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        const data = deepCloneObject<InteriorInternal>(interior);
        delete data.players;
        delete data.factions;
        delete data.storage;
        delete data.insideShape;
        delete data.outsideShape;
        delete data.ipl;

        alt.emitClient(player, INTERIOR_INTERACTIONS.SHOW_MENU, interior, isOutside);
    }

    /**
     * Add an object to an interior.
     * @static
     * @param {(string | number)} id
     * @param {IObject} objectData
     * @memberof InteriorSystem
     */
    static async addObject(uid: string, objectData: IObject): Promise<string> {
        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return null;
        }

        if (!interior.objects) {
            interior.objects = [];
        }

        const index = interior.objects.findIndex((x) => x.uid === objectData.uid);
        if (index !== -1) {
            alt.logWarning(`Please Use Unique Identifiers for Interior Objects. ${objectData.uid}`);
            objectData.uid = `${objectData.uid}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
        }

        interior.objects.push(objectData);
        await Database.updatePartialData(interior._id, { objects: interior.objects }, INTERIOR_COLLECTIONS.CORE);

        const foundPlayers = alt.Player.all.filter((p) => interior.players.findIndex((ip) => ip === p.id) >= 0);
        for (let i = 0; i < foundPlayers.length; i++) {
            const player = foundPlayers[i];
            if (!player || !player.valid) {
                continue;
            }

            InternalSystem.refreshInteriorForPlayer(player);
        }

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
        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        if (!interior.objects) {
            interior.objects = [];
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

        await Database.updatePartialData(interior._id, { objects: interior.objects }, INTERIOR_COLLECTIONS.CORE);

        const foundPlayers = alt.Player.all.filter((p) => interior.players.findIndex((ip) => ip === p.id) >= 0);
        for (let i = 0; i < foundPlayers.length; i++) {
            const player = foundPlayers[i];
            if (!player || !player.valid) {
                continue;
            }

            InternalSystem.refreshInteriorForPlayer(player);
        }
    }

    /**
     * Adds a faction to an interior.
     * @static
     * @param {string} id Interior Identifier
     * @param {string} faction
     * @return {*}
     * @memberof InteriorSystem
     */
    static async addFactionOwnership(uid: string, faction: string): Promise<boolean> {
        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return false;
        }

        if (!interior.factions) {
            interior.factions = [];
        }

        const existingFaction = interior.factions.find((x) => x === faction);
        if (existingFaction) {
            return true;
        }

        interior.factions.push(faction);
        await Database.updatePartialData(
            interior._id.toString(),
            { factions: interior.factions },
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
    static async removeFactionOwnership(uid: string, faction: string): Promise<boolean> {
        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return false;
        }

        if (!interior.factions) {
            interior.factions = [];
        }

        const factionIndex = interior.factions.findIndex((x) => x === faction);
        if (factionIndex <= -1) {
            return true;
        }

        interior.factions.splice(factionIndex, 1);
        await Database.updatePartialData(
            interior._id.toString(),
            { factions: interior.factions },
            Collections.Interiors,
        );

        return true;
    }

    /**
     * Remove a owner from an interior.
     * @static
     * @param {string} id Interior Identifier
     * @return {*}
     * @memberof InteriorSystem
     */
    static async removeOwnership(uid: string): Promise<boolean> {
        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return false;
        }

        interior.owner = null;
        await Database.updatePartialData(interior._id.toString(), { owner: interior.owner }, Collections.Interiors);
        InteriorSystem.refresh(interior.uid);

        return true;
    }

    /**
     * Public facing purchase function that calls internal purchase.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async purchase(player: alt.Player, uid: string, skipDistanceCheck = false, skipOwnerCheck = false) {
        InternalSystem.purchase(player, uid, skipDistanceCheck, skipOwnerCheck);
    }

    /**
     * Public facing setPrice function that calls internal setPrice.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async setPrice(
        player: alt.Player,
        uid: string,
        value: number,
        skipDistanceCheck = false,
        skipOwnerCheck = false,
    ) {
        InternalSystem.setPrice(player, uid, value, skipDistanceCheck, skipOwnerCheck);
    }

    /**
     * Public facing toggleLock function that calls internal toggleLock.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async toggleLock(player: alt.Player, uid: string, skipOwnerCheck = false) {
        InternalSystem.toggleLock(player, uid, skipOwnerCheck);
    }

    /**
     * Public facing setName function that calls internal setName.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async setName(
        player: alt.Player,
        uid: string,
        name: string,
        skipDistanceCheck = false,
        skipOwnerCheck = false,
    ) {
        InternalSystem.setName(player, uid, name, skipDistanceCheck, skipOwnerCheck);
    }

    /**
     * Public facing storage function that calls internal storage.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof InteriorSystem
     */
    static async storage(player: alt.Player, uid: string) {
        InternalSystem.storage(player, uid);
    }
}

alt.on('playerDisconnect', (player: alt.Player, reason: string) => {
    InternalSystem.removePlayer(player);
});

alt.onClient(INTERIOR_INTERACTIONS.SET_NAME, InternalSystem.setName);
alt.onClient(INTERIOR_INTERACTIONS.SET_PRICE, InternalSystem.setPrice);
alt.onClient(INTERIOR_INTERACTIONS.PURCHASE, InternalSystem.purchase);
alt.onClient(INTERIOR_INTERACTIONS.STORAGE, InternalSystem.storage);
alt.onClient(INTERIOR_INTERACTIONS.TOGGLE_LOCK, InternalSystem.toggleLock);
alt.onClient(INTERIOR_INTERACTIONS.ENTER, InteriorSystem.movePlayerIn);
alt.onClient(INTERIOR_INTERACTIONS.EXIT, InteriorSystem.movePlayerOut);
PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, InternalSystem.spawn);
