import * as alt from 'alt-server';
import { distance } from '../../shared/utility/vector';
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
};

const players = {
    /**
     * Return all players currently online.
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

export const getters = {
    player,
    players,
    vehicle,
    vehicles,
};

Object.keys(getters).forEach((key) => {
    console.log(Object.keys(getters[key]));
});
