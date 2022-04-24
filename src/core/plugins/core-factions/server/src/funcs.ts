import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { Character } from '../../../../shared/interfaces/character';
import { FactionHandler, FACTION_COLLECTION } from './handler';
import { StorageSystem } from '../../../../server/systems/storage';
import { Vector3 } from '../../../../shared/interfaces/vector';
import { VehicleSystem } from '../../../../server/systems/vehicle';
import { VEHICLE_RULES } from '../../../../shared/enums/vehicleRules';
import { IResponse } from '../../../../shared/interfaces/iResponse';
import { Faction, FactionRank, RankPermissions } from '../../shared/interfaces';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { Athena } from '../../../../server/api/athena';

let hasInitialized = false;

/**
 * ? addMember
 * ? kickMember
 * ? setRank
 * ? addRank
 * ? removeRank
 * ? updateRankName
 * ? updateRankWeight
 * ? addBank
 * ? removeBank
 *
 * @export
 * @class FactionFuncs
 */
export class FactionFuncs {
    /**
     * This function is called when factions are initialized. It adds custom rules to the
     * VehicleSystem to check for faction specific vehicles.
     * @returns None
     */
    static init() {
        if (hasInitialized) {
            return;
        }

        hasInitialized = true;
        VehicleSystem.addCustomRule(VEHICLE_RULES.UNLOCK, FactionFuncs.handleFactionVehicleChecks);
        VehicleSystem.addCustomRule(VEHICLE_RULES.LOCK, FactionFuncs.handleFactionVehicleChecks);
        VehicleSystem.addCustomRule(VEHICLE_RULES.ENGINE, FactionFuncs.handleFactionVehicleChecks);
        VehicleSystem.addCustomRule(VEHICLE_RULES.STORAGE, FactionFuncs.handleFactionVehicleChecks);
        VehicleSystem.addCustomRule(VEHICLE_RULES.DOOR, FactionFuncs.handleFactionVehicleChecks);
    }

    /**
     * Handle refreshing the faction information.
     *
     * @static
     * @param {Faction} faction
     * @memberof FactionFuncs
     */
    static updateMembers(faction: Faction) {
        const memberIdentifiers = Object.keys(faction.members);
        const members = alt.Player.all.filter(
            (p) => p && p.valid && p.data && memberIdentifiers.includes(p.data._id.toString()),
        );

        alt.emitClient(members, FACTION_EVENTS.PROTOCOL.REFRESH, faction);
    }

    /**
     * Check if the vehicle is owned by a faction, if it is, check if the player is in the same
     * faction, if they are, check if the vehicle is in the faction vehicles list, if it is, check if
     * the player has access to the vehicle, if they do, return true, else return false.
     *
     * @param player - alt.Player - The player that is trying to use the vehicle
     * @param vehicle - The vehicle that is being checked.
     * @returns A response object with the status and response properties.
     */
    static handleFactionVehicleChecks(player: alt.Player, vehicle: alt.Vehicle): IResponse {
        if (!vehicle.data) {
            return { status: true, response: 'Not a faction vehicle' };
        }

        // Check if vehicle is owned by a faction
        const faction = FactionHandler.get(vehicle.data.owner);
        if (!faction) {
            return { status: true, response: 'Not a faction vehicle' };
        }

        // Check if in same faction
        if (vehicle.data.owner !== player.data.faction) {
            return { status: false, response: 'Not in same faction for vehicle usage' };
        }

        // Check if the vehicle identifier exists in the faction vehicles list
        const index = faction.vehicles.findIndex((fv) => fv.id === vehicle.data._id.toString());
        if (index <= -1) {
            return { status: false, response: 'Vehicle not found for faction' };
        }

        // Check if the players rank has access to this vehicle specifically
        const character = FactionFuncs.getFactionMemberRank(faction, player.data._id.toString());
        if (!character) {
            return { status: false, response: 'Player not found in faction' };
        }

        if (faction.vehicles[index].allowRanks.findIndex((ar) => ar === character.uid) <= -1) {
            return { status: false, response: 'Faction rank does not have access to vehicle' };
        }

        return { status: true, response: 'Has Faction Rank Access' };
    }

    /**
     * Get a faction character's rank based on character identifier
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterId
     * @return {(FactionRank | null)}
     * @memberof FactionFuncs
     */
    static getFactionMemberRank(faction: Faction, characterId: string): FactionRank | null {
        const member = faction.members[characterId];
        if (!member) {
            return null;
        }

        return faction.ranks.find((r) => r.uid === member.rank);
    }

    /**
     * Returns the lowest rank for the faction based on weight
     *
     * @static
     * @param {Faction} faction
     * @return {*}
     * @memberof FactionFuncs
     */
    static getRankWithLowestWeight(faction: Faction): FactionRank {
        let lowestRank = faction.ranks[0];

        for (let i = 0; i < faction.ranks.length; i++) {
            if (faction.ranks[i].weight >= lowestRank.weight) {
                continue;
            }

            lowestRank = faction.ranks[i];
        }

        return lowestRank;
    }

    /**
     * Check if a rank is above another rank
     *
     * @static
     * @param {Faction} faction
     * @param {string} _rank
     * @param {string} _vsRank
     * @return {*}
     * @memberof FactionFuncs
     */
    static isRankAbove(faction: Faction, _rank: string, _vsRank: string): boolean {
        const rank = faction.ranks.find((r) => r.uid === _rank);
        const vsRank = faction.ranks.find((r) => r.uid === _vsRank);
        return rank.weight > vsRank.weight ? true : false;
    }

    /**
     * Check if a rank is below another rank
     *
     * @static
     * @param {Faction} faction
     * @param {string} _rank
     * @param {string} _vsRank
     * @return {*}
     * @memberof FactionFuncs
     */
    static isRankBelow(faction: Faction, _rank: string, _vsRank: string): boolean {
        const rank = faction.ranks.find((r) => r.uid === _rank);
        const vsRank = faction.ranks.find((r) => r.uid === _vsRank);
        return rank.weight < vsRank.weight ? true : false;
    }

    /**
     * Add to faction bank.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {number} amount
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async addBank(faction: Faction, amount: number): Promise<boolean> {
        amount = Math.abs(amount);

        faction.bank += amount;
        const didUpdate = await FactionHandler.update(faction._id as string, { bank: faction.bank });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Remove from faction bank, returns false if amount is too high.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {number} amount
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async subBank(faction: Faction, amount: number): Promise<boolean> {
        amount = Math.abs(amount);

        if (faction.bank - amount < 0) {
            return false;
        }

        faction.bank -= amount;
        const didUpdate = await FactionHandler.update(faction._id as string, { bank: faction.bank });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Arbitrary way to set a rank for a character regardless of their standing.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterID
     * @param {string} newRank
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async setCharacterRank(faction: Faction, characterID: string, newRank: string): Promise<boolean> {
        const rankIndex = faction.ranks.findIndex((x) => x.uid === newRank);
        if (rankIndex <= -1) {
            return false;
        }

        if (faction.ranks[rankIndex].weight >= 99) {
            return false;
        }

        faction.members[characterID].rank = newRank;

        const didUpdate = await FactionHandler.update(faction._id as string, { members: faction.members });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Arbitrary way to add a character to a faction based on character identifier.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterID
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async addMember(faction: Faction, characterID: string): Promise<boolean> {
        const lowestRank = FactionFuncs.getRankWithLowestWeight(faction);
        const character = await Database.fetchData<Character>('_id', characterID, Collections.Characters);
        if (!character) {
            return false;
        }

        const onlinePlayer = alt.Player.all.find(
            (x) => x && x.valid && x.data && x.data._id.toString() === characterID,
        );

        if (onlinePlayer) {
            onlinePlayer.data.faction = faction._id.toString();
        }

        faction.members[characterID] = {
            id: characterID,
            name: character.name,
            rank: lowestRank.uid,
            hasOwnership: false,
        };

        await Database.updatePartialData(
            character._id.toString(),
            { faction: faction._id.toString() },
            FACTION_COLLECTION,
        );

        const didUpdate = await FactionHandler.update(faction._id as string, { members: faction.members });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Arbitrary way to kick a character from a faction.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} characterID
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async kickMember(faction: Faction, characterID: string): Promise<boolean> {
        const character = await Database.fetchData<Character>(`_id`, characterID, Collections.Characters);
        if (character) {
            await Database.updatePartialData(character._id.toString(), { faction: null }, Collections.Factions);
        }

        delete faction.members[characterID];
        const didUpdate = await FactionHandler.update(faction._id as string, { members: faction.members });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Change a rank name based on rank uid
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} rankUid
     * @param {string} newName
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async updateRankName(faction: Faction, rankUid: string, newName: string): Promise<boolean> {
        const index = faction.ranks.findIndex((r) => r.uid === rankUid);
        if (index <= -1) {
            return false;
        }

        faction.ranks[index].name = newName;
        const didUpdate = await FactionHandler.update(faction._id as string, { ranks: faction.ranks });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Removes a rank from the rank list for a faction.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} rankUid
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async removeRank(faction: Faction, rankUid: string): Promise<boolean> {
        const index = faction.ranks.findIndex((r) => r.uid === rankUid);

        // Do not allow less than two ranks at any given time.
        if (faction.ranks.length <= 2) {
            return false;
        }

        if (index <= -1) {
            return false;
        }

        if (faction.ranks[index].weight >= 99) {
            return false;
        }

        const orderedRanks = faction.ranks.sort((a, b) => {
            return b.weight - a.weight;
        });

        const orderedRankIndex = faction.ranks.findIndex((x) => x.uid === faction.ranks[index].uid);
        let replacementRank: FactionRank;

        // What does this mean?
        // It means that if the orderedRankIndex is the LAST element in the array.
        // We know that the only option is to go up the array for the next weight.
        // Thus resulting in the rank we need.
        if (orderedRankIndex === faction.ranks.length - 1) {
            replacementRank = faction.ranks[faction.ranks.length - 2];
        } else {
            // Now if it's NOT the last element in the array.
            // We need to increase the orderedRankIndex by 1.
            // Since it's ordered that means the smallest weight is in the back.
            replacementRank = faction.ranks[orderedRankIndex + 1];
        }

        const removedRank = faction.ranks.splice(index, 1)[0];

        if (!removedRank) {
            FactionFuncs.updateMembers(faction);
            return false;
        }

        if (replacementRank) {
            Object.keys(faction.members).forEach((key) => {
                if (faction.members[key].rank !== removedRank.uid) {
                    return;
                }

                faction.members[key].rank = replacementRank.uid;
            });
        }

        const didUpdate = await FactionHandler.update(faction._id as string, {
            ranks: faction.ranks,
            members: faction.members,
        });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Adds a rank to the ranks list for a faction.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} newName
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async addRank(faction: Faction, newName: string, weight: number): Promise<boolean> {
        const rankIndex = faction.ranks.findIndex((r) => r.weight === weight);
        if (rankIndex >= 0) {
            return false;
        }

        faction.ranks.push({
            name: newName,
            actionPermissions: [],
            rankPermissions: {
                addMembers: false,
                bankAdd: false,
                bankRemove: false,
                kickMembers: false,
                manageMembers: false,
                manageRanks: false,
                manageRankPermissions: false,
            },
            vehicles: [],
            weight,
            uid: Athena.utility.hash.sha256Random(JSON.stringify(faction.ranks)),
        });

        const didUpdate = await FactionHandler.update(faction._id as string, { ranks: faction.ranks });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Updates the rank permission structure for a rank.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} rankUid
     * @param {RankPermissions} rankPermissions
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async updateRankPermissions(
        faction: Faction,
        rankUid: string,
        rankPermissions: RankPermissions,
    ): Promise<boolean> {
        const index = faction.ranks.findIndex((r) => r.uid === rankUid);
        if (index <= -1) {
            return false;
        }

        faction.ranks[index].rankPermissions = rankPermissions;
        const didUpdate = await FactionHandler.update(faction._id as string, { ranks: faction.ranks });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Updates rank weight to specified weight.
     * Ensures that rank is not already weight 99.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} rankUid
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async updateRankWeight(faction: Faction, rankUid: string, weight: number): Promise<boolean> {
        if (weight <= -1 || weight >= 99) {
            return false;
        }

        const index = faction.ranks.findIndex((r) => r.uid === rankUid);
        if (index <= -1) {
            return false;
        }

        faction.ranks[index].weight = weight;
        const didUpdate = await FactionHandler.update(faction._id as string, { ranks: faction.ranks });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Swap rank weights based on uids.
     *
     * @static
     * @param {Faction} faction
     * @param {string} swap
     * @param {string} swapWith
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async swapRanks(faction: Faction, swap: string, swapWith: string): Promise<boolean> {
        const fromIndex = faction.ranks.findIndex((r) => r.uid === swap);
        const withIndex = faction.ranks.findIndex((r) => r.uid === swapWith);

        if (fromIndex <= -1 || withIndex <= -1) {
            return false;
        }

        const fromWeight = faction.ranks[fromIndex].weight;
        const withWeight = faction.ranks[withIndex].weight;

        faction.ranks[fromIndex].weight = withWeight;
        faction.ranks[withIndex].weight = fromWeight;

        const didUpdate = await FactionHandler.update(faction._id as string, { ranks: faction.ranks });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Create a storage facility for the faction.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @return {*}
     * @memberof FactionFuncs
     */
    static async createStorage(faction: Faction, name: string, pos: Vector3) {
        if (!faction.storages) {
            faction.storages = [];
        }

        const storage = await StorageSystem.create({ cash: 0, items: [], maxSize: 128 });
        if (!storage) {
            return false;
        }

        faction.storages.push({ id: storage._id.toString(), name, allowRanks: [], pos });
        const didUpdate = await FactionHandler.update(faction._id as string, { storages: faction.storages });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Add a rank to access a storage facility.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {number} storageIndex
     * @param {string} rankUid
     * @return {*}
     * @memberof FactionFuncs
     */
    static async addRankToStorage(faction: Faction, storageIndex: number, rankUid: string) {
        const index = faction.ranks.findIndex((r) => r.uid === rankUid);
        if (index <= -1) {
            return false;
        }

        if (!faction.storages[storageIndex]) {
            return false;
        }

        const existingRankIndex = faction.storages[storageIndex].allowRanks.findIndex((ar) => ar === rankUid);
        if (existingRankIndex >= 0) {
            return false;
        }

        faction.storages[storageIndex].allowRanks.push(rankUid);
        const didUpdate = await FactionHandler.update(faction._id as string, { storages: faction.storages });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Remove a rank from a storage facility
     * Auto-saves
     *
     * @param {Faction} faction - Faction
     * @param {number} storageIndex - The index of the storage in the faction's storages array.
     * @param {string} rankUid - The uid of the rank to remove from the storage.
     */
    static async removeRankFromStorage(faction: Faction, storageIndex: number, rankUid: string) {
        const index = faction.ranks.findIndex((r) => r.uid === rankUid);
        if (index <= -1) {
            return false;
        }

        if (!faction.storages[storageIndex]) {
            return false;
        }

        const existingRankIndex = faction.storages[storageIndex].allowRanks.findIndex((ar) => ar === rankUid);
        if (existingRankIndex <= -1) {
            return false;
        }

        faction.storages[storageIndex].allowRanks.splice(existingRankIndex, 1);
        const didUpdate = await FactionHandler.update(faction._id as string, { storages: faction.storages });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Add a vehicle to the faction garage
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} vehicleUid
     * @param {string} name
     * @return {*}
     * @memberof FactionFuncs
     */
    static async addVehicle(faction: Faction, vehicleUid: string, name: string) {
        if (!faction.vehicles) {
            faction.vehicles = [];
        }

        faction.vehicles.push({ name, id: vehicleUid, allowRanks: [] });
        const didUpdate = await FactionHandler.update(faction._id as string, { vehicles: faction.vehicles });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Remove a vehicle from the faction garage.
     * Auto-saves
     *
     * @static
     * @param {Faction} faction
     * @param {string} vehicleUid
     * @return {*}
     * @memberof FactionFuncs
     */
    static async removeVehicle(faction: Faction, vehicleUid: string) {
        if (!faction.vehicles) {
            return false;
        }

        const index = faction.vehicles.findIndex((fv) => fv.id === vehicleUid);
        if (index <= -1) {
            return false;
        }

        faction.vehicles.splice(index, 1);
        const didUpdate = await FactionHandler.update(faction._id as string, { vehicles: faction.vehicles });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Add a rank to a vehicle.
     * Auto-saves
     *
     * @param {Faction} faction - Faction
     * @param {string} vehicleUid - _id of the vehicle
     * @param {string} rankUid - The rank to add to the vehicle
     */
    static async addRankToVehicle(faction: Faction, vehicleUid: string, rankUid: string) {
        if (!faction.vehicles) {
            return false;
        }

        const index = faction.vehicles.findIndex((fv) => fv.id === vehicleUid);
        if (index <= -1) {
            return false;
        }

        // Already Exists
        const rankIndex = faction.vehicles[index].allowRanks.findIndex((ar) => ar === rankUid);
        if (rankIndex >= 0) {
            return false;
        }

        faction.vehicles[index].allowRanks.push(rankUid);
        const didUpdate = await FactionHandler.update(faction._id as string, { vehicles: faction.vehicles });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Remove a rank from a vehicle.
     * Auto-saves
     *
     * @param {Faction} faction - Faction
     * @param {string} vehicleUid - The vehicle's _id
     * @param {string} rankUid - The rank to remove from the vehicle.
     */
    static async removeRankFromVehicle(faction: Faction, vehicleUid: string, rankUid: string) {
        if (!faction.vehicles) {
            return false;
        }

        const index = faction.vehicles.findIndex((fv) => fv.id === vehicleUid);
        if (index <= -1) {
            return false;
        }

        // Does not exist
        const rankIndex = faction.vehicles[index].allowRanks.findIndex((ar) => ar === rankUid);
        if (rankIndex <= -1) {
            return false;
        }

        faction.vehicles[index].allowRanks.splice(rankIndex, 1);
        const didUpdate = await FactionHandler.update(faction._id as string, { vehicles: faction.vehicles });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Add a callable player faction action to a faction.
     *
     * @static
     * @param {Faction} faction
     * @param {string} rankUid
     * @param {string} actionUid
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async addPlayerAction(faction: Faction, rankUid: string, actionUid: string): Promise<boolean> {
        if (!faction.actions[rankUid]) {
            faction.actions[rankUid] = [];
        }

        const index = faction.actions[rankUid].findIndex((uid) => uid === actionUid);
        if (index >= 0) {
            return false;
        }

        faction.actions[rankUid].push(actionUid);
        const didUpdate = await FactionHandler.update(faction._id as string, { actions: faction.actions });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * removePlayerAction removes an action from the faction
     * @param {Faction} faction - Faction - The faction that the action is being removed from.
     * @param {string} rankUid - The rankUid of the rank that the action belongs to.
     * @param {string} actionUid - The unique ID of the action to remove.
     */
    static async removePlayerAction(faction: Faction, rankUid: string, actionUid: string): Promise<boolean> {
        if (!faction.actions[rankUid]) {
            faction.actions[rankUid] = [];
        }

        const index = faction.actions[rankUid].findIndex((uid) => uid === actionUid);
        if (index <= -1) {
            return false;
        }

        faction.actions[rankUid].splice(index, 1);
        const didUpdate = await FactionHandler.update(faction._id as string, { actions: faction.actions });

        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Add a tick action to a faction.
     * @param {Faction} faction - Faction
     * @param {string} actionUid - The unique identifier of the action to add.
     * @returns A boolean value.
     */
    static async addTickAction(faction: Faction, actionUid: string): Promise<boolean> {
        if (!faction.tickActions) {
            faction.tickActions = [];
        }

        const index = faction.tickActions.findIndex((uid) => uid === actionUid);
        if (index <= -1) {
            return false;
        }

        faction.tickActions.push(actionUid);
        const didUpdate = await FactionHandler.update(faction._id as string, { tickActions: faction.tickActions });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }

    /**
     * Add a tick action to a faction.
     * @param {Faction} faction - Faction
     * @param {string} actionUid - The unique identifier of the action to add.
     * @returns A boolean value.
     */
    static async removeTickAction(faction: Faction, actionUid: string): Promise<boolean> {
        if (!faction.tickActions) {
            faction.tickActions = [];
        }

        const index = faction.tickActions.findIndex((uid) => uid === actionUid);
        if (index >= 0) {
            return false;
        }

        faction.tickActions.splice(index, 1);
        const didUpdate = await FactionHandler.update(faction._id as string, { tickActions: faction.tickActions });
        if (didUpdate.status) {
            FactionFuncs.updateMembers(faction);
        }

        return didUpdate.status;
    }
}
