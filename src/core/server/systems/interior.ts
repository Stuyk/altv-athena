import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Interior } from '../../shared/interfaces/Interior';
import { Vector3 } from '../../shared/interfaces/Vector';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import Logger from '../utility/athenaLogger';
import { InteractionController } from './interaction';
import { MarkerController } from './marker';
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
}

let nextInterior = 0;
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

        nextInterior = interiors.length;

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

    static createDefaultInteriors() {
        InteriorSystem.create({
            name: 'Diamond Resorts Casino',
            outside: { x: 935.1909790039062, y: 46.17036819458008, z: 81.09584045410156 },
            inside: { x: 1089.8856201171875, y: 206.2451629638672, z: -49.5 }
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
            ipl: interior.ipl
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

        interior._id = nextInterior;
        const newInterior = await Database.insertData<Interior>(interior, Collections.Interiors, true);
        if (!newInterior) {
            return null;
        }

        Logger.log(`Created New Interior at ${newInterior._id.toString()} with name ${newInterior.name}`);

        // Update the Array
        newInterior._id = newInterior._id.toString(); // Convert Interior ID to String
        interiors.push(newInterior);
        InteriorSystem.add(newInterior);

        // Update Interior Count
        nextInterior += 1;
        return newInterior;
    }

    /**
     * Called when a player is 'entering' an interior.
     * @static
     * @param {alt.Player} player
     * @memberof InteriorSystem
     */
    static async enter(player: alt.Player, id: string) {
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
        if (!interior.inside) {
            interior.inside = InteractionController.add({
                description: `Try Door`,
                position: interior.insidePosition,
                type: `interior`,
                identifier: `house-inside-${id}`,
                data: [id],
                callback: InteriorSystem.exit
            });

            MarkerController.append({
                uid: `house-marker-inside-${id}`,
                maxDistance: 15,
                color: new alt.RGBA(255, 255, 255, 75),
                pos: interior.insidePosition,
                type: 0
            });
        }

        // Load IPL Here
        player.dimension = parseInt(id);
        playerFuncs.safe.setPosition(
            player,
            interior.insidePosition.x,
            interior.insidePosition.y,
            interior.insidePosition.z
        );

        // Save Interior Info Here for Player
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
        player.dimension = 0;
        playerFuncs.safe.setPosition(
            player,
            interior.outsidePosition.x,
            interior.outsidePosition.y,
            interior.outsidePosition.z
        );

        // Clear Interior Info Here
    }
}

InteriorSystem.init();
