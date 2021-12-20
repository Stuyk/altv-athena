import * as alt from 'alt-server';

import './player';
import { Interior } from '../../../shared-plugins/core-interiors/interfaces';
import Database from '@stuyk/ezmongodb';
import { sha256Random } from '../../../server/utility/encryption';
import { InteriorInternal } from './interfaces';
import { ServerMarkerController } from '../../../server/streamers/marker';
import { InteractionController } from '../../../server/systems/interaction';
import { InteriorView } from './view';
import { playerFuncs } from '../../../server/extensions/Player';
import { distance } from '../../../shared/utility/vector';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { INTERIOR_SYSTEM } from '../../../shared-plugins/core-interiors/flags';
import { INTERIOR_RULES } from '../../../shared-plugins/core-interiors/enums';
import SystemRules from '../../../server/systems/rules';
import { IResponse } from '../../../shared/interfaces/IResponse';
import { SYSTEM_EVENTS } from '../../../shared/enums/System';
import { ServerObjectController } from '../../../server/streamers/object';
import { ServerTextLabelController } from '../../../server/streamers/textlabel';

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
const INTERIOR_COLLECTION = 'interiors';
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

        ServerMarkerController.append({
            uid: `${interior.uid}-outside`,
            maxDistance: 15,
            color: new alt.RGBA(255, 255, 0, 75),
            pos: interior.outside,
            scale: { x: 0.25, y: 0.25, z: 0.25 },
            type: 0,
        });

        interiorInfo.outsideShape = InteractionController.add({
            description: `Open Interior Menu`,
            position: interior.outside,
            type: `interior`,
            identifier: `${interior.uid}-outside`,
            data: [interior.uid, true],
            callback: InteriorView.showMenu,
        });

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
        const id = player.id;
        const data = player.data;

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
    private static refreshInteriorText(interior: InteriorInternal): void {
        // Begin Outside Text Label Information
        let outsideName = '';

        outsideName += `${interior.name}`;

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

        ServerTextLabelController.remove(`${interior.uid}-outside`);
        ServerTextLabelController.append({
            uid: `${interior.uid}-outside`,
            pos: aboveGroundOutside,
            data: outsideName,
            maxDistance: 10,
        });
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
        await Database.createCollection(INTERIOR_COLLECTION);
        const entries = await Database.fetchAllData<Interior>(INTERIOR_COLLECTION);

        if (entries.length <= 0) {
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

        await Database.insertData<Interior>(interior, INTERIOR_COLLECTION, true);
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

        await Database.deleteById(interior._id.toString(), INTERIOR_COLLECTION);
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
                playerFuncs.emit.notification(player, 'LOCALE_TOO_FAR_FROM_DOOR');
                return false;
            }
        }

        if (isFlagEnabled(interior.system, INTERIOR_SYSTEM.HAS_LOCK) && !interior.isUnlocked) {
            playerFuncs.emit.notification(player, 'LOCALE_DOOR_IS_LOCKED');
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
            interior.insideShape = InteractionController.add({
                description: `Open Interior Menu`,
                position: interior.inside,
                type: `interior`,
                identifier: `${interior.uid}-inside`,
                data: [interior.uid, false],
                callback: InteriorView.showMenu,
                dimension: interior.dimension,
            });

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

        playerFuncs.safe.setDimension(player, interior.dimension);

        // Added solely for synchronizing interior for player's who
        // logged out inside of an interior.
        if (!noTeleport) {
            playerFuncs.set.frozen(player, true);
            playerFuncs.safe.setPosition(player, interior.inside.x, interior.inside.y, interior.inside.z);

            // Freeze Player for Interior Loading
            alt.setTimeout(() => {
                playerFuncs.set.frozen(player, false);
            }, 1000);
        }

        player.data.interior = interior.uid;
        playerFuncs.save.field(player, 'interior', player.data.interior);
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
            playerFuncs.safe.setDimension(player, 0);
            playerFuncs.safe.setPosition(player, LOST_PLAYER_POS.x, LOST_PLAYER_POS.y, LOST_PLAYER_POS.z);
            return false;
        }

        if (interior.ipl) {
            alt.emitClient(player, SYSTEM_EVENTS.IPL_UNLOAD, interior.ipl);
        }

        const dist = distance(player.pos, interior.inside);
        if (dist > DOOR_CHECK_DIST) {
            playerFuncs.emit.notification(player, 'LOCALE_TOO_FAR_FROM_EXIT');
            return false;
        }

        if (!SystemRules.check(INTERIOR_RULES.EXIT, rules, player, interior)) {
            return false;
        }

        InternalSystem.removePlayer(player, interior);
        InternalSystem.refreshInteriorForPlayer(player);

        playerFuncs.set.frozen(player, true);
        playerFuncs.safe.setDimension(player, 0);
        playerFuncs.safe.setPosition(player, interior.outside.x, interior.outside.y, interior.outside.z);
        player.data.interior = null;
        playerFuncs.save.field(player, 'interior', player.data.interior);
        alt.setTimeout(() => {
            if (!player || !player.valid) {
                return;
            }

            playerFuncs.set.frozen(player, false);
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

        if (interior.keys && interior.keys.findIndex((id) => id === player.data._id.toString()) >= 0) {
            return true;
        }

        const hasFactionSupport = interior.factions && player.data.faction;
        if (hasFactionSupport && interior.factions.findIndex((id) => id === player.data.faction) >= 0) {
            return true;
        }

        return false;
    }
}

alt.on('playerDisconnect', InternalSystem.removePlayer);
