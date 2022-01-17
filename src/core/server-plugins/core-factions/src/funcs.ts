import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { playerFuncs } from '../../../server/extensions/extPlayer';
import { Collections } from '../../../server/interface/iDatabaseCollections';
import { CurrencyTypes } from '../../../shared/enums/currency';
import { Character } from '../../../shared/interfaces/character';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { FACTION_CONFIG } from './config';
import { FactionSystem, FACTION_COLLECTION } from './system';
import {
    Faction,
    FactionCharacter,
    FactionRank,
    RankPermissions,
} from '../../../shared-plugins/core-factions/interfaces';
import { StorageSystem } from '../../../server/systems/storage';
import { Vector3 } from '../../../shared/interfaces/vector';
import { VehicleSystem } from '../../../server/systems/vehicle';
import { VEHICLE_RULES } from '../../../shared/enums/vehicleRules';
import { IResponse } from '../../../shared/interfaces/iResponse';

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
class FactionFuncs {
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
        const faction = FactionSystem.get(vehicle.data.owner);
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
        const didUpdate = await FactionSystem.update(faction._id as string, { bank: faction.bank });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { bank: faction.bank });
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
        faction.members[characterID].rank = newRank;
        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
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

        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { members: faction.members });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { ranks: faction.ranks });
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
        if (index <= -1) {
            return false;
        }

        if (faction.ranks[index].weight >= 99) {
            return false;
        }

        faction.ranks.splice(index, 1);
        const didUpdate = await FactionSystem.update(faction._id as string, { ranks: faction.ranks });
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
    static async addRank(faction: Faction, newName: string): Promise<boolean> {
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
            weight: 1,
        });

        const didUpdate = await FactionSystem.update(faction._id as string, { ranks: faction.ranks });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { ranks: faction.ranks });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { ranks: faction.ranks });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { storages: faction.storages });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { storages: faction.storages });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { storages: faction.storages });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { vehicles: faction.vehicles });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { vehicles: faction.vehicles });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { vehicles: faction.vehicles });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { vehicles: faction.vehicles });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { actions: faction.actions });
        return didUpdate.status;
    }

    /**
     * removePlayerAction removes an action from the faction
     * @param {Faction} faction - Faction - The faction that the action is being removed from.
     * @param {string} rankUid - The rankUid of the rank that the action belongs to.
     * @param {string} actionUid - The unique ID of the action to remove.
     */
    static async removePlayerAction(faction: Faction, rankUid: string, actionUid: string): Promise<void> {
        if (!faction.actions[rankUid]) {
            faction.actions[rankUid] = [];
        }

        const index = faction.actions[rankUid].findIndex((uid) => uid === actionUid);
        if (index <= -1) {
            return;
        }

        faction.actions[rankUid].splice(index, 1);
        await FactionSystem.update(faction._id as string, { actions: faction.actions });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { tickActions: faction.tickActions });
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
        const didUpdate = await FactionSystem.update(faction._id as string, { tickActions: faction.tickActions });
        return didUpdate.status;
    }
}

/**
 * Bound to the player to manipulate individual faction functionality.
 * Performs various permission checks, and rank checks before completing an action.
 *
 * @export
 * @class FactionPlayerFuncs
 */
class FactionPlayerFuncs {
    /**
     * Verify a player is a Faction Admin
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static isAdmin(player: alt.Player): boolean {
        for (let i = 0; i < FACTION_CONFIG.FactionAdmins.length; i++) {
            const isAdmin = isFlagEnabled(player.accountData.permissionLevel, FACTION_CONFIG.FactionAdmins[i]);
            if (!isAdmin) {
                continue;
            }

            return true;
        }

        return false;
    }

    /**
     * Check if a player is an owner of the faction.
     *
     * @static
     * @param {alt.Player} player
     * @return {boolean}
     * @memberof FactionPlayerFuncs
     */
    static isOwner(player: alt.Player): boolean {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!faction.members[player.data._id.toString()]) {
            return false;
        }

        return faction.members[player.data._id.toString()].hasOwnership;
    }

    /**
     * Verify if player is owner of faction or admin of factions.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}  {boolean}
     * @memberof FactionPlayerFuncs
     */
    static isOwnerOrAdmin(player: alt.Player): boolean {
        let isAdmin = FactionPlayerFuncs.isAdmin(player);
        let isOwner = FactionPlayerFuncs.isOwner(player);
        return isAdmin || isOwner ? true : false;
    }

    /**
     * Get the FactionRank of a player in a faction.
     *
     * @static
     * @param {alt.Player} player
     * @return {FactionRank}
     * @memberof FactionFuncs
     */
    static getPlayerFactionRank(player: alt.Player): FactionRank | null {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return null;
        }

        const member = faction.members[player.data._id.toString()];
        if (!member) {
            return null;
        }

        return faction.ranks.find((r) => r.uid === member.rank);
    }

    /**
     * Get FactionCharacter from faction player is in.
     *
     * @static
     * @param {alt.Player} player
     * @return {FactionCharacter}
     * @memberof FactionFuncs
     */
    static getPlayerInFaction(player: alt.Player): FactionCharacter {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return null;
        }

        return faction.members[player.data._id.toString()];
    }

    /**
     * Add a target player to a faction.
     * Ensures addMembers permission.
     * Target must not be in a faction.
     *
     * @static
     * @param {alt.Player} player
     * @param {alt.Player} target
     * @return {boolean}
     * @memberof FactionFuncs
     */
    static async addMember(player: alt.Player, target: alt.Player): Promise<boolean> {
        if (!target || !target.valid || !target.data || target.data.faction) {
            return false;
        }

        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id.toString());
            if (!selfRank.rankPermissions.addMembers) {
                return false;
            }
        }

        const didUpdate = await FactionFuncs.addMember(faction, target.data._id.toString());
        if (!didUpdate) {
            return false;
        }

        target.data.faction = faction._id as string;
        return true;
    }

    /**
     * Kick a target character from a faction.
     * Ensures kick member permission.
     * Cannot kick member higher than player rank.
     *
     * @static
     * @param {alt.Player} player
     * @param {alt.Player} target
     * @return {boolean}
     * @memberof FactionFuncs
     */
    static async kickMember(player: alt.Player, characterId: string): Promise<boolean> {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!faction.members[characterId]) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.kickMembers) {
                return false;
            }

            // Check they are below current rank.
            const memberRank = FactionFuncs.getFactionMemberRank(faction, characterId);
            if (!FactionFuncs.isRankBelow(faction, selfRank.uid, memberRank.uid)) {
                return false;
            }
        }

        const target = alt.Player.all.find((p) => p && p.valid && p.data._id.toString() === characterId);
        if (target) {
            target.data.faction = null;
        }

        return await FactionFuncs.kickMember(faction, characterId);
    }

    /**
     * Allows the user to set the rank of users below them.
     * Ensures set rank permission.
     * Rank cannot be higher or equal to the player's rank
     *
     * @static
     * @param {alt.Player} player
     * @param {string} characterId
     * @param {string} newRank
     * @return {Promise<boolean>}
     * @memberof FactionFuncs
     */
    static async setCharacterRank(player: alt.Player, characterId: string, rankUid: string): Promise<boolean> {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!faction.members[characterId]) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageMembers) {
                return false;
            }

            // Get the player being updated's rank.
            const rank = FactionFuncs.getFactionMemberRank(faction, characterId);
            if (!self || !rank) {
                return false;
            }

            // Cannot set rank to self rank
            if (selfRank.uid === rankUid) {
                return false;
            }

            // Ensure the rank update does not exceed current rank of self
            const isCurrentRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, rank.uid);
            const isNextRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, rankUid);
            if (isCurrentRankAbove || isNextRankAbove) {
                return false;
            }
        }

        return await FactionFuncs.setCharacterRank(faction, characterId, rankUid);
    }

    /**
     * Add currency to the faction bank.
     * Ensures bank add permission.
     *
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @return {*}
     * @memberof FactionFuncs
     */
    static async addBank(player: alt.Player, amount: number) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.bankAdd) {
                return false;
            }
        }

        amount = Math.abs(amount);
        if (!playerFuncs.currency.subAllCurrencies(player, amount)) {
            return false;
        }

        return await FactionFuncs.addBank(faction, amount);
    }

    /**
     * Remove money from a faction to a player.
     * Ensures bank removal permission.
     *
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static async subBank(player: alt.Player, amount: number) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.bankRemove) {
                return false;
            }
        }

        amount = Math.abs(amount);
        const didRemove = FactionFuncs.subBank(faction, amount);
        if (!didRemove) {
            return false;
        }

        if (!playerFuncs.currency.add(player, CurrencyTypes.CASH, amount)) {
            return false;
        }

        return true;
    }

    /**
     * Adds a new rank to a faction.
     * Ensures manageRanks permission.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} newName
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static async addRank(player: alt.Player, newName: string) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageRanks) {
                return false;
            }
        }

        return await FactionFuncs.addRank(faction, newName);
    }

    /**
     * Removes a rank from the rank list.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} rankUid
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static async removeRank(player: alt.Player, rankUid: string) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageRanks) {
                return false;
            }

            const isRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, rankUid);
            if (isRankAbove) {
                return false;
            }
        }

        return await FactionFuncs.removeRank(faction, rankUid);
    }

    static async setRankName(player: alt.Player, rankUid: string, newName: string) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageRanks) {
                return false;
            }

            if (selfRank.uid === rankUid) {
                return false;
            }

            const isRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, rankUid);
            if (isRankAbove) {
                return false;
            }
        }

        return await FactionFuncs.updateRankName(faction, rankUid, newName);
    }

    /**
     * Overrides rank permissions for a rank.
     * Ensures manageRankPermissions
     * Cannot change rank permissions for a rank above self or self.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} rankUid
     * @param {RankPermissions} rankPermissions
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static async setRankPermissions(player: alt.Player, rankUid: string, rankPermissions: RankPermissions) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageRankPermissions) {
                return false;
            }

            if (selfRank.uid === rankUid) {
                return false;
            }

            const isRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, rankUid);
            if (isRankAbove) {
                return false;
            }
        }

        return await FactionFuncs.updateRankPermissions(faction, rankUid, rankPermissions);
    }

    /**
     * Set the weight of a rank.
     * @param player - The player who is trying to change the rank weight.
     * @param {string} rankUid - The rank to update.
     * @param {number} weight - The weight of the rank.
     */
    static async setRankWeight(player: alt.Player, rankUid: string, weight: number) {
        const faction = FactionSystem.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageRanks) {
                return false;
            }

            if (selfRank.uid === rankUid) {
                return false;
            }

            const isRankAbove = FactionFuncs.isRankAbove(faction, selfRank.uid, rankUid);
            if (isRankAbove) {
                return false;
            }
        }

        return await FactionFuncs.updateRankWeight(faction, rankUid, weight);
    }
}

export const factionFuncs = {
    init: FactionFuncs.init,
    player: FactionPlayerFuncs,
    system: FactionFuncs,
    utility: FactionSystem,
};
