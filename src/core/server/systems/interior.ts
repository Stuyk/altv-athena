import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Interior } from '../../shared/interfaces/Interior';
import { getClosestVectorByPos } from '../../shared/utility/vector';
import { playerFuncs } from '../extensions/Player';
import { Collections } from '../interface/DatabaseCollections';
import Logger from '../utility/athenaLogger';
import { distance2d } from '../utility/vector';

interface InteriorInfo {
    interior: Interior;
    isInside: boolean;
}

const MAXIMUM_EXTERIOR_DISTANCE = 5;
const MAXIMUM_INTERIOR_DISTANCE = 10;
const db: Database = getDatabase();
const interiors: Array<Interior> = [];
let dimension = 0;

export class InteriorController {
    /**
     *
     * @static
     * @memberof InteriorController
     */
    static async load() {
        const interiors = await db.fetchAllData<Interior>(Collections.Interiors);
        let count = 0;

        for (let i = 0; i < interiors.length; i++) {
            InteriorController.populate(interiors[i]);
            count += 1;
        }

        Logger.info(`Total Interiors: ${count}`);
    }

    /**
     * Populate an interior into memory.
     * @static
     * @param {Interior} interior
     * @memberof InteriorController
     */
    static populate(interior: Interior) {
        dimension += 1; // Increment Dimension
        interior.dimension = dimension; // Assign Dimension to Interior

        // Populate ColShapes?
        // Add Dimension to ColShape?
    }

    /**
     * Create an interior to be added to your database.
     * Interiors automatically populate on creation, and rejoin.
     * @static
     * @param {Interior} interior
     * @return {*}  {(Promise<Interior | boolean>)}
     * @memberof InteriorController
     */
    static async create(ownerIdentification: string, interior: Interior): Promise<Interior | boolean> {
        if (!interior.outside) {
            Logger.error(`Missing outside position for interior.`);
            return false;
        }

        if (!interior.inside) {
            Logger.error(`Missing outside position for interior.`);
            return false;
        }

        if (!interior.name) {
            Logger.error(`Missing name for interior.`);
            return false;
        }

        if (!interior.forSale) {
            interior.forSale = false;
        }

        if (!interior.lockStatus) {
            interior.lockStatus = true;
        }

        if (!interior.friends) {
            interior.friends = [ownerIdentification];
        }

        if (!interior.factions) {
            interior.factions = [];
        }

        if (!interior.mlos) {
            interior.mlos = [];
        }

        if (!interior.furniture) {
            interior.furniture = [];
        }

        return await db.insertData<Interior>(interior, Collections.Interiors, true);
    }

    /**
     * Remove an interior based on a unique document identifier.
     * Also removes all players online out of the interior.
     * @static
     * @param {string} _id
     * @return {*}  {Promise<boolean>}
     * @memberof InteriorController
     */
    static async remove(interiorID: string): Promise<boolean> {
        interiorID = interiorID.toString();

        const index = interiors.findIndex((i) => i._id.toString() === interiorID);
        if (index >= 0) {
            const interiorsRemoved = interiors.splice(index, 1);
            const interior = interiorsRemoved[0];

            if (interior) {
                alt.Player.all.forEach((player) => {
                    if (player.data.interior.toString() === interior._id.toString()) {
                        playerFuncs.safe.setPosition(
                            player,
                            interior.outside.x,
                            interior.outside.y,
                            interior.outside.z
                        );
                    }
                });
            }
        }

        return await db.deleteById(interiorID, Collections.Interiors);
    }

    /**
     * Validate the player is the owner of an interior.
     * @static
     * @param {alt.Player} player
     * @param {string} interiorID
     * @return {*}  {boolean}
     * @memberof InteriorController
     */
    static isOwner(player: alt.Player, interior: Interior): boolean {
        return interior.friends[0] === player.data._id.toString();
    }

    /**
     * Validate the player is the owner of an interior by their id.
     * @static
     * @param {string} playerID
     * @param {Interior} interior
     * @return {*}  {boolean}
     * @memberof InteriorController
     */
    static isOwnerByID(playerID: string, interior: Interior): boolean {
        return interior.friends[0] === playerID.toString();
    }

    /**
     * Check if the player has access to enter / exit an interior.
     * @static
     * @param {alt.Player} player
     * @param {Interior} interior
     * @return {*}  {boolean}
     * @memberof InteriorController
     */
    static hasAccess(player: alt.Player, interior: Interior): boolean {
        let index = interiors.findIndex((i) => i._id.toString() === interior._id.toString());
        if (index <= -1) {
            return false;
        }

        const foundInterior = interiors[index];
        return foundInterior.friends.includes(player.data._id.toString());
    }

    /**
     * Determine if a faction has access to this interior.
     * @static
     * @param {alt.Player} player
     * @return {*}  {boolean}
     * @memberof InteriorController
     */
    static hasFactionAccess(player: alt.Player): boolean {
        // To Be Added
        return false;
    }

    /**
     * Find the closest interior and return information about it.
     * @static
     * @param {alt.Player} player
     * @return {*}  {({ interior: Interior; isInside: boolean } | null)}
     * @memberof InteriorController
     */
    static findClosestInterior(player: alt.Player): InteriorInfo | null {
        let index;
        let interior;
        let isInside = false;

        if (player.data.interior) {
            index = interiors.findIndex((i) => i._id.toString() === player.data.interior.toString());
            if (index <= -1) {
                return null;
            }

            interior = interiors[index];
            isInside = true;
        } else {
            interior = getClosestVectorByPos<Interior>(player.pos, interiors, 'outside');

            if (!interior) {
                return null;
            }

            // If the distance outside exceeds. Check for an interior option.
            const dist = distance2d(player.pos, interior.outside);
            if (dist > MAXIMUM_EXTERIOR_DISTANCE) {
                interior = getClosestVectorByPos<Interior>(player.pos, interiors, 'inside');

                const dist = distance2d(player.pos, interior.inside);
                if (dist > MAXIMUM_INTERIOR_DISTANCE) {
                    return null;
                }

                isInside = true;
            }
        }

        return { interior, isInside };
    }
}
