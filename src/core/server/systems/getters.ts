import * as alt from 'alt-server';
import { distance, distance2d } from '../../shared/utility/vector';
import { getForwardVector } from '../utility/vector';
import { Identifier } from './identifier';

const player = {
    /**
     * Gets an online player by account identifier based on their MongoDB account _id.
     *
     * @param {string} id
     * @return {(alt.Player | undefined)}
     */
    byAccount(id: string): alt.Player | undefined {
        return alt.Player.all.find((x) => x.accountData && x.accountData._id === id);
    },
    /**
     * Gets an online player by their name.
     * Not case sensitive and returns the first player it finds matching that name.
     *
     * @param {string} name
     * @return {(alt.Player | undefined)}
     */
    byName(name: string): alt.Player | undefined {
        name = name.toLowerCase().replace('_', ''); // Normalize My_Name to myname
        return alt.Player.all.find((x) => x.data && x.data.name && x.data.name === name);
    },
    /**
     * Get an online player based on their MongoDB _id
     *
     * @param {string} id
     * @return {(alt.Player | undefined)}
     */
    byDatabaseID(id: string): alt.Player | undefined {
        return alt.Player.all.find((x) => x.data && x.data._id && x.data._id === id);
    },
    /**
     * Return a player based on their ID given the Identifier strategy currently setup.
     * Use this to get the player in-game that you see with your eyes.
     *
     * @param {number} id
     * @return {(alt.Player | undefined)}
     */
    byID(id: number): alt.Player | undefined {
        return Identifier.getPlayer(id);
    },
    /**
     * Creates a temporary ColShape in front of the player.
     * The ColShape is then used to check if the entity is present within the ColShape.
     * It will keep subtract distance until it finds a player near the player that is in the ColShape.
     * Works best on flat land or very close distances.
     *
     * @param {alt.Player} player
     * @param {number} [startDistance=2]
     * @return {(alt.Player | undefined)}
     */
    async inFrontOf(player: alt.Player, startDistance = 6): Promise<alt.Player | undefined> {
        const fwdVector = getForwardVector(player.rot);
        const closestPlayers = [...alt.Player.all].filter((p) => {
            if (p.id === player.id) {
                return false;
            }

            const dist = distance2d(player.pos, p.pos);
            if (dist > startDistance) {
                return false;
            }

            return true;
        });

        if (closestPlayers.length <= 0) {
            return undefined;
        }

        while (startDistance > 1) {
            for (const target of closestPlayers) {
                const fwdPos = {
                    x: player.pos.x + fwdVector.x * startDistance,
                    y: player.pos.y + fwdVector.y * startDistance,
                    z: player.pos.z - 1,
                };

                const colshape = new alt.ColshapeSphere(fwdPos.x, fwdPos.y, fwdPos.z, 2);

                await alt.Utils.wait(10);

                const isInside = colshape.isEntityIn(target);
                colshape.destroy();

                if (isInside) {
                    return target;
                }
            }

            startDistance -= 0.5;
        }

        return undefined;
    },
    /**
     * Checks if a player is within 3 distance of a position.
     *
     * @param {alt.Player} player
     * @param {alt.IVector3} pos
     */
    isNearPosition(player: alt.Player, pos: alt.IVector3, dist = 3): boolean {
        return distance(player.pos, pos) <= dist;
    },
    /**
     * Get the current waypoint marked on a player's map.
     * Will return undefined it is not currently set.
     *
     * @param {alt.Player} player
     * @return {(alt.IVector3 | undefined)}
     */
    waypoint(player: alt.Player): alt.IVector3 | undefined {
        return player.currentWaypoint;
    },
};

const players = {
    /**
     * Return all players currently online and logged into a character.
     *
     * @return {alt.Player[]}
     */
    online(): alt.Player[] {
        return [...alt.Player.all].filter((x) => x.data && x.data._id);
    },
    /**
     * Gets all players around a specific position.
     *
     * @param {alt.IVector3} pos
     * @param {number} range
     * @return {alt.Player[]}
     */
    inRange(pos: alt.IVector3, range: number): alt.Player[] {
        const players = [...alt.Player.all].filter((x) => x.data && x.data._id);

        if (players.length <= 0) {
            return [];
        }

        return players.filter((x) => x.pos && distance(pos, x.pos) <= range);
    },
    /**
     * Gets all online players with a given name.
     *
     * @param {string} name
     * @return {alt.Player[]}
     */
    withName(name: string): alt.Player[] {
        name = name.toLowerCase().replace('_', ''); // Normalize My_Name to myname
        return alt.Player.all.filter((x) => x.data && x.data.name && x.data.name === name);
    },
    /**
     * Returns all players who are currently driving a vehicle.
     *
     * @return {alt.Player[]}
     */
    driving(): alt.Player[] {
        return alt.Player.all.filter((x) => {
            if (!x.valid || !x.data || !x.data._id || !x.vehicle) {
                return false;
            }

            if (!x.vehicle || !x.vehicle.driver || x.vehicle.driver.id !== x.id) {
                return false;
            }

            return true;
        });
    },
    /**
     * Return all players who are currently walking / on foot.
     *
     * @return {alt.Player[]}
     */
    walking(): alt.Player[] {
        return alt.Player.all.filter((x) => {
            if (!x.valid || !x.data || !x.data._id || x.vehicle) {
                return false;
            }

            return true;
        });
    },
    /**
     * Return all online players driving a specific vehicle model.
     *
     * @param {(string | number)} model
     * @return {alt.Player[]}
     */
    drivingSpecificModel(model: string | number): alt.Player[] {
        if (typeof model === 'string') {
            model = alt.hash(model);
        }

        if (!vehicle.isValidModel(model)) {
            throw new Error(`${model} is not a valid vehicle model.`);
        }

        return alt.Player.all.filter((x) => {
            if (!x.valid || !x.data || !x.data._id || x.vehicle) {
                return false;
            }

            return x.vehicle.model === model;
        });
    },
    /**
     * Returns all passengers and the driver.
     * No specific order.
     *
     * @param {alt.Vehicle} vehicle
     * @return {alt.Player[]}
     */
    inVehicle(vehicle: alt.Vehicle): alt.Player[] {
        return alt.Player.all.filter((x) => x.vehicle && x.vehicle.id === vehicle.id);
    },
};

const vehicle = {
    /**
     * Get a vehicle by their alt:V ID
     *
     * @param {number} id
     * @return {(alt.Vehicle | undefined)}
     */
    byID(id: number): alt.Vehicle | undefined {
        return alt.Vehicle.all.find((x) => x.id === id);
    },
    /**
     * Get a vehicle based on their database _id
     * May return undefined if the vehicle is not currently spawned.
     *
     * @param {string} id
     * @return {(alt.Vehicle | undefined)}
     */
    byDatabaseID(id: string): alt.Vehicle | undefined {
        return alt.Vehicle.all.find((x) => x && x.data && x.data._id === id);
    },
    /**
     * Check if a vehicle model is currently valid.
     * Use `alt.hash` to hash a plain text model. ex: `alt.hash('infernus')`
     *
     * @param {number} model
     * @return {boolean}
     */
    isValidModel(model: number): boolean {
        try {
            const vehicle = new alt.Vehicle(model, 0, 0, 0, 0, 0, 0);
            alt.nextTick(() => {
                vehicle.destroy();
            });
            return true;
        } catch (err) {
            return false;
        }
    },
    /**
     * Creates a temporary ColShape in front of the current vehicle or player.
     * The ColShape is then used to check if a vehicle is present within the ColShape.
     * It will keep subtract distance until it finds a vehicle near the player that is in the ColShape.
     * Works best on flat land or very close distances.
     *
     * @param {alt.Player} player
     * @param {number} [startDistance=2]
     * @return {(alt.Vehicle | undefined)}
     */
    async inFrontOf(entity: alt.Entity, startDistance = 6): Promise<alt.Vehicle | undefined> {
        const fwdVector = getForwardVector(entity.rot);
        const closestVehicles = [...alt.Vehicle.all].filter((p) => {
            if (p.id === entity.id) {
                return false;
            }

            const dist = distance2d(entity.pos, p.pos);
            if (dist > startDistance) {
                return false;
            }

            return true;
        });

        if (closestVehicles.length <= 0) {
            return undefined;
        }

        while (startDistance > 1) {
            for (const target of closestVehicles) {
                const fwdPos = {
                    x: entity.pos.x + fwdVector.x * startDistance,
                    y: entity.pos.y + fwdVector.y * startDistance,
                    z: entity.pos.z - 1,
                };

                const colshape = new alt.ColshapeSphere(fwdPos.x, fwdPos.y, fwdPos.z, 2);

                await alt.Utils.wait(10);

                const isInside = colshape.isEntityIn(target);
                colshape.destroy();

                if (isInside) {
                    return target;
                }
            }

            startDistance -= 0.5;
        }

        return undefined;
    },
    /**
     * Checks if a vehicle is within 3 distance of a position.
     *
     * @param {alt.Vehicle} vehicle
     * @param {alt.IVector3} pos
     */
    isNearPosition(vehicle: alt.Vehicle, pos: alt.IVector3, dist = 3): boolean {
        return distance(vehicle.pos, pos) <= dist;
    },
    /**
     * Returns all passengers and the driver.
     * No specific order.
     *
     * @param {alt.Vehicle} vehicle
     * @return {alt.Player[]}
     */
    passengers(vehicle: alt.Vehicle): alt.Player[] {
        return players.inVehicle(vehicle);
    },
    /**
     * Just wraps the `vehicle.driver` lookup.
     * Returns a player if they are driving this vehicle.
     *
     * @param {alt.Vehicle} vehicle
     * @return {(alt.Player | undefined)}
     */
    driver(vehicle: alt.Vehicle): alt.Player | undefined {
        return vehicle.driver;
    },
};

const vehicles = {
    /**
     * Get all vehicles in range of a position
     *
     * @param {alt.IVector3} pos
     * @param {number} range
     * @return {alt.Vehicle[]}
     */
    inRange(pos: alt.IVector3, range: number): alt.Vehicle[] {
        return alt.Vehicle.all.filter((x) => {
            if (!x.valid || !x.pos) {
                return false;
            }

            return distance(x.pos, pos) <= range;
        });
    },
};

const world = {
    /**
     * Check if a world position is free of vehicles.
     *
     * @param {alt.IVector3} pos
     * @param {string} type
     * @return {Promise<boolean>}
     */
    async positionIsClear(pos: alt.IVector3, lookFor: 'vehicle' | 'player' | 'all'): Promise<boolean> {
        const colshape = new alt.ColshapeCylinder(pos.x, pos.y, pos.z - 1, 2, 2);
        await alt.Utils.wait(10);

        let entity: alt.Entity;
        if (lookFor === 'vehicle' || lookFor === 'all') {
            entity = alt.Vehicle.all.find((veh) => colshape.isEntityIn(veh));
        }

        if (typeof entity !== 'undefined') {
            return false;
        }

        if (lookFor === 'player' || lookFor === 'all') {
            entity = alt.Player.all.find((p) => colshape.isEntityIn(p));
        }

        if (typeof entity !== 'undefined') {
            return false;
        }

        return typeof entity === 'undefined' ? true : false;
    },
    /**
     * Used to check if an entity is in ocean water.
     * Uses a simple 'z' positional check and dimension check.
     *
     * @param {alt.Entity} entity
     */
    isInOceanWater(entity: alt.Entity) {
        if (entity.dimension !== 0) {
            alt.log('wrong dimension');
            return false;
        }

        if (entity.pos.z - 1 > 0.5) {
            return false;
        }

        return true;
    },
};

export const getters = {
    player,
    players,
    vehicle,
    vehicles,
    world,
};

// Used to test some stuff...
// alt.setInterval(async () => {
//     const target = alt.Player.all[0];

//     if (!target || !target.valid) {
//         return;
//     }

//     const isNear = player.isNearPosition(target, {
//         x: -1585.9503173828125,
//         y: -1189.7266845703125,
//         z: 1.959155559539795,
//     });

//     if (isNear) {
//         console.log('is near...');
//     }
// }, 1000);
