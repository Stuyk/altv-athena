import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Interior } from '../../shared/interfaces/Interior';
import { IObject } from '../../shared/interfaces/IObject';
import { Vector3 } from '../../shared/interfaces/Vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import Logger from '../utility/athenaLogger';
import { getMissingNumber } from '../utility/math';
import { InteractionController } from './interaction';
import { MarkerController } from './marker';
import { ObjectController } from './object';
import { TextLabelController } from './textlabel';

interface InteriorInfo {
    /**
     * The ColShape used to enter the interior.
     * @type {alt.Colshape}
     * @memberof InteriorInfo
     */
    outside: alt.Colshape;

    /**
     * The position to use to initialize the inside ColShape.
     * @type {Vector3}
     * @memberof InteriorInfo
     */
    insidePosition: Vector3;

    /**
     * The position to use to initialize the outside ColShape.
     * @type {Vector3}
     * @memberof InteriorInfo
     */
    outsidePosition: Vector3;

    /**
     * The ColShape used to exit the interior.
     * This ColShape is only created when a player is 'entering' the interior.
     * @type {alt.Colshape}
     * @memberof InteriorInfo
     */
    inside?: alt.Colshape;

    /**
     * The IPL to load if necessary when 'entering' the interior.
     * @type {string}
     * @memberof InteriorInfo
     */
    ipl?: string;

    /**
     * List of players inside of the interior.
     * Does not remove players who logout or are no longer valid.
     * Check for validity yourself if you use this.
     * @type {Array<alt.Player>}
     * @memberof InteriorInfo
     */
    players: Array<alt.Player>;

    /**
     * Objects to create / delete in the interior.
     * @type {Array<IObject>}
     * @memberof InteriorInfo
     */
    objects: Array<IObject>;
}

let interiors: Array<Interior> = [];
let interiorData: { [id: string]: InteriorInfo } = {};
let isReady = false;

export class InteriorSystem {
    /**
     * Fetch all interiors from the Database and populate cached data.
     * @static
     * @memberof InteriorSystem
     */
    static async init() {
        interiors = await Database.fetchAllData<Interior>(Collections.Interiors);

        if (!Array.isArray(interiors)) {
            interiors = [];
        }

        for (let i = 0; i < interiors.length; i++) {
            interiors[i]._id = interiors[i]._id.toString(); // Convert Interior IDs to String
            InteriorSystem.add(interiors[i]);
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
            return parseInt(`${interior._id}`);
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
            objects: []
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
        outsideName += `ID: ${interior._id}`;

        MarkerController.append({
            uid: `house-marker-outside-${interior._id}`,
            maxDistance: 15,
            color: new alt.RGBA(255, 255, 255, 75),
            pos: groundOutside,
            type: 0
        });

        TextLabelController.append({
            uid: `house-text-outside-${interior._id}`,
            pos: aboveGroundOutside,
            data: outsideName,
            maxDistance: 10
        });

        const outsideColShape = InteractionController.add({
            description: `Try Door`,
            position: groundOutside,
            type: `interior`,
            identifier: `house-outside-${interior._id}`,
            data: [interior._id.toString()],
            callback: InteriorSystem.enter
        });

        // Propogate Cache Information
        interiorData[interior._id.toString()] = {
            outside: outsideColShape,
            insidePosition: groundInside,
            outsidePosition: groundOutside,
            ipl: interior.ipl,
            players: [],
            objects: interior.objects ? interior.objects : []
        };
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

        if (interior._id) {
            console.error(new Error(`Do not specify an _id for an interior during creation. Used ID: ${interior._id}`));
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

        interior._id = InteriorSystem.getNextID();
        const newInterior = await Database.insertData<Interior>(interior, Collections.Interiors, true);
        if (!newInterior) {
            return null;
        }

        // Update the Array
        newInterior._id = newInterior._id.toString(); // Convert Interior ID to String
        interiors.push(newInterior);
        InteriorSystem.add(newInterior);

        Logger.log(`Created New Interior at ${newInterior._id.toString()} with name ${newInterior.name}`);
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

        if (!interiorData[player.data.interior]) {
            throw new Error(`Could not refresh interior objects for ${player.data.interior}`);
        }

        alt.log(`Refreshing interior for ${player.data.name}`);
        const interior = interiorData[player.data.interior];
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
        if (!interiorData[id]) {
            throw new Error(`Could not add interior object for interior ${id}`);
        }

        const index = interiorData[id].objects.findIndex((x) => x.uid === objectData.uid);
        if (index !== -1) {
            Logger.warning(`Please Use Unique Identifiers for Interior Objects. ${objectData.uid}`);
            objectData.uid = `${objectData.uid}${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
        }

        interiorData[id].objects.push(objectData);
        await Database.updatePartialData(id, { objects: interiorData[id].objects }, Collections.Interiors);

        interiorData[id].players.forEach((player) => {
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
        if (!interiorData[id]) {
            throw new Error(`Could not add interior object for interior ${id}`);
        }

        let wasModified = false;

        for (let i = interiorData[id].objects.length - 1; i >= 0; i--) {
            if (interiorData[id].objects[i].uid !== uid) {
                continue;
            }

            wasModified = true;
            interiorData[id].objects.splice(i, 1);
            break;
        }

        if (!wasModified) {
            return;
        }

        await Database.updatePartialData(id, { objects: interiorData[id].objects }, Collections.Interiors);

        interiorData[id].players.forEach((player) => {
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
        if (!player || !player.valid) {
            return;
        }

        if (player.data.isDead) {
            return;
        }

        if (!id) {
            return;
        }

        if (!interiorData[id]) {
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

        const interior = interiorData[id];
        if (!interior.inside) {
            interior.inside = InteractionController.add({
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
        if (!player || !player.valid) {
            return;
        }

        if (player.data.isDead) {
            return;
        }

        if (!id) {
            return;
        }

        if (!interiorData[id]) {
            return;
        }

        const interior = interiorData[id];
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
