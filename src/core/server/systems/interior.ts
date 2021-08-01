import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { INTERIOR_SYSTEM, INTERIOR_TYPES } from '../../shared/flags/interiorFlags';
import { Interior } from '../../shared/interfaces/Interior';
import { IObject } from '../../shared/interfaces/IObject';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import { InteriorInfo } from '../interface/InteriorInfo';
import Logger from '../utility/athenaLogger';
import { getMissingNumber } from '../utility/math';
import { InteractionController } from './interaction';
import { MarkerController } from './marker';
import { ObjectController } from './object';
import { TextLabelController } from './textlabel';

let interiors: Array<InteriorInfo> = [];
let isReady = false;

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

    static createDefaultInteriors() {
        // This only gets inserted into the database once.
        // Any additional changes have be removed / updated whatever.
        InteriorSystem.create({
            name: 'Diamond Resorts Casino',
            outside: { x: 935.1909790039062, y: 46.17036819458008, z: 81.09584045410156 },
            inside: { x: 1089.8856201171875, y: 206.2451629638672, z: -49.5 },
            objects: [],
            system: INTERIOR_SYSTEM.NONE,
            type: INTERIOR_TYPES.SYSTEM
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
            z: interior.outside.z - 1
        };

        const aboveGroundOutside = {
            x: interior.outside.x,
            y: interior.outside.y,
            z: interior.outside.z + 0.75
        };

        const groundInside = {
            x: interior.inside.x,
            y: interior.inside.y,
            z: interior.inside.z - 0.5
        };

        let outsideName = '';

        outsideName += `${interior.name}~n~`;
        outsideName += `ID: ${interior.id}`;

        MarkerController.append({
            uid: `house-marker-outside-${interior.id}`,
            maxDistance: 15,
            color: new alt.RGBA(255, 255, 255, 75),
            pos: groundOutside,
            type: 0
        });

        TextLabelController.append({
            uid: `house-text-outside-${interior.id}`,
            pos: aboveGroundOutside,
            data: outsideName,
            maxDistance: 10
        });

        const outsideColShape = InteractionController.add({
            description: `Try Door`,
            position: groundOutside,
            type: `interior`,
            identifier: `house-outside-${interior.id}`,
            data: [interior.id.toString()],
            callback: InteriorSystem.enter
        });

        interiors.push({
            ...interior,
            outsideShape: outsideColShape,
            insidePosition: groundInside,
            outsidePosition: groundOutside,
            ipl: interior.ipl,
            players: [],
            objects: interior.objects ? interior.objects : []
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

        if (!interior.storage) {
            interior.storage = [];
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
        interiors.push(newInterior);
        InteriorSystem.add(newInterior);

        Logger.log(`Created New Interior at ${newInterior.id.toString()} with name ${newInterior.name}`);
        return newInterior;
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
            ObjectController.removeFromPlayer(player, objects[i].uid, true);
        }

        // Reset Objects and Re-Add Them
        if (player.dimension === 0) {
            return;
        }

        for (let i = 0; i < objects.length; i++) {
            objects[i].isInterior = true;
            ObjectController.addToPlayer(player, objects[i]);
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
     * Called when a player is 'entering' an interior.
     * This can also be called when the player is logging in.
     * @static
     * @param {alt.Player} player
     * @memberof InteriorSystem
     */
    static async enter(player: alt.Player, id: string, doNotTeleport = false) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        const interior = interiors.find((ref) => `${ref.id}` === `${id}`);
        if (!interior) {
            return;
        }

        const dist = distance2d(player.pos, interior.outsidePosition);
        if (dist >= 5) {
            playerFuncs.emit.notification(player, `Too far from entrance.`);
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
                    DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z
                );
            }
            return;
        }

        if (!interior.insideShape) {
            interior.insideShape = InteractionController.add({
                description: `Try Door`,
                position: interior.insidePosition,
                type: `interior`,
                identifier: `house-inside-${id}`,
                data: [id],
                callback: InteriorSystem.exit,
                dimension: parseInt(id)
            });

            MarkerController.append({
                uid: `house-marker-inside-${id}`,
                maxDistance: 15,
                color: new alt.RGBA(255, 255, 255, 75),
                pos: interior.insidePosition,
                type: 0,
                dimension: parseInt(id)
            });
        }

        if (interior.ipl) {
            alt.emitClient(player, SYSTEM_EVENTS.IPL_LOAD, interior.ipl);
        }

        playerFuncs.safe.setDimension(player, parseInt(id));

        // Added solely for synchronizing interior for player's who
        // logged out inside of an interior.
        if (!doNotTeleport) {
            playerFuncs.set.frozen(player, true);

            playerFuncs.safe.setPosition(
                player,
                interior.insidePosition.x,
                interior.insidePosition.y,
                interior.insidePosition.z
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
    }

    /**
     * Called when a player is 'exiting' an interior.
     * @static
     * @param {alt.Player} player
     * @memberof InteriorSystem
     */
    static async exit(player: alt.Player, id: string) {
        if (!player || !player.valid || player.data.isDead || !id) {
            return;
        }

        const interior = interiors.find((ref) => `${ref.id}` === `${id}`);
        if (!interior) {
            return;
        }

        const dist = distance2d(player.pos, interior.insidePosition);
        if (dist >= 5) {
            playerFuncs.emit.notification(player, `Too far from exit.`);
            return;
        }

        playerFuncs.safe.setDimension(player, 0);
        playerFuncs.safe.setPosition(
            player,
            interior.outsidePosition.x,
            interior.outsidePosition.y,
            interior.outsidePosition.z
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
        player.data.interior = '0';
        playerFuncs.save.field(player, 'interior', null);
    }
}

InteriorSystem.init();
