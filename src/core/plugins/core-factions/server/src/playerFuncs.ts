import * as alt from 'alt-server';
import { FactionCharacter, FactionRank, RankPermissions } from '../../shared/interfaces';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { isFlagEnabled } from '../../../../shared/utility/flags';
import { FACTION_CONFIG } from './config';
import { FactionFuncs } from './funcs';
import { FactionHandler } from './handler';
import { Athena } from '../../../../server/api/athena';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { distance, getClosestVector } from '../../../../shared/utility/vector';

/**
 * Bound to the player to manipulate individual faction functionality.
 * Performs various permission checks, and rank checks before completing an action.
 *
 * @export
 * @class FactionPlayerFuncs
 */
export class FactionPlayerFuncs {
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
        const faction = FactionHandler.get(player.data.faction);
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
        const faction = FactionHandler.get(player.data.faction);
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
        const faction = FactionHandler.get(player.data.faction);
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

        const faction = FactionHandler.get(player.data.faction);
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
        const faction = FactionHandler.get(player.data.faction);
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
        const faction = FactionHandler.get(player.data.faction);
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
        const faction = FactionHandler.get(player.data.faction);
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
        if (!Athena.player.currency.subAllCurrencies(player, amount)) {
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
        const faction = FactionHandler.get(player.data.faction);
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

        if (!Athena.player.currency.add(player, CurrencyTypes.CASH, amount)) {
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
    static async addRank(player: alt.Player, newName: string, weight: number) {
        const faction = FactionHandler.get(player.data.faction);
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

        return await FactionFuncs.addRank(faction, newName, weight);
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
        const faction = FactionHandler.get(player.data.faction);
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

    /**
     * Set the name of a rank.
     * @param player - The player who is trying to change the rank name.
     * @param {string} rankUid - The rank's unique ID.
     * @param {string} newName - The new name for the rank.
     * @returns A boolean value.
     */
    static async setRankName(player: alt.Player, rankUid: string, newName: string) {
        const faction = FactionHandler.get(player.data.faction);
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
        const faction = FactionHandler.get(player.data.faction);
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

    static async swapRanks(player: alt.Player, swap: string, swapWith: string) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (faction.ranks.findIndex((x) => x.uid === swap) === -1) {
            return false;
        }

        if (faction.ranks.findIndex((x) => x.uid === swapWith) === -1) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageRanks) {
                return false;
            }

            if (selfRank.uid === swap) {
                return false;
            }
        }

        return await FactionFuncs.swapRanks(faction, swap, swapWith);
    }

    /**
     * Set the weight of a rank.
     * @param player - The player who is trying to change the rank weight.
     * @param {string} rankUid - The rank to update.
     * @param {number} weight - The weight of the rank.
     */
    static async setRankWeight(player: alt.Player, rankUid: string, weight: number) {
        const faction = FactionHandler.get(player.data.faction);
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

    /**
     * Sets the head quarter location of the faction.
     * Requires ownership permission.
     *
     * @static
     * @param {alt.Player} player
     * @param {alt.Vector3} pos
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static async setHeadQuarters(player: alt.Player, pos: alt.Vector3) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwner(player)) {
            return false;
        }

        return await FactionFuncs.setHeadQuarters(faction, pos);
    }

    /**
     * Sets the blip for the faction. Re
     *
     * @static
     * @param {alt.Player} player
     * @param {number} blip
     * @param {number} [color=36]
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static async setBlip(player: alt.Player, blip: number | undefined, color: number | undefined = 36) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwner(player)) {
            return false;
        }

        return await FactionFuncs.setBlip(faction, blip, color);
    }

    /**
     * If the player is the owner of the faction, add a parking spot to the faction.
     * @param player - alt.Player - The player who is adding the parking spot.
     * @param pos - alt.Vector3
     * @returns a boolean value.
     */
    static async addParkingSpot(player: alt.Player, pos: alt.Vector3, rot: alt.Vector3) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwner(player)) {
            return false;
        }

        if (!player.vehicle) {
            return await FactionFuncs.addParkingSpot(faction, new alt.Vector3(pos.x, pos.y, pos.z - 0.5), rot);
        }

        return await FactionFuncs.addParkingSpot(faction, pos, rot);
    }

    /**
     * If the player is the owner of the faction, remove the parking spot at the given index.
     * @param player - alt.Player - The player who is calling the function
     * @param {number} index - number - The index of the parking spot you want to remove.
     * @returns The return value is a boolean.
     */
    static async removeParkingSpot(player: alt.Player, index: number) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwner(player)) {
            return false;
        }

        return await FactionFuncs.removeParkingSpot(faction, index);
    }

    /**
     * If the player is the owner or admin of the faction, or if the player has the permission to manage
     * vehicles, then purchase the vehicle.
     * @param player - alt.Player - The player who is purchasing the vehicle.
     * @param {string} model - The model of the vehicle you want to purchase.
     * @returns The return value is a boolean.
     */
    static async purchaseVehicle(player: alt.Player, model: string) {
        let result = true;
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            result = false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageVehicles) {
                result = false;
            }
        }

        // If everything passed so far, try the purchase.
        if (result) {
            result = await FactionFuncs.purchaseVehicle(faction, model);
        }

        // Play sound based on the result.
        Athena.player.emit.soundFrontend(
            player,
            result ? 'Hack_Success' : 'Hack_Failed',
            'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS',
        );

        return result;
    }

    /**
     * If the player is the owner or admin of the faction, toggle the vehicle permission for the
     * specified rank.
     * @param player - alt.Player - The player who is calling the function.
     * @param {string} rank - string - The rank you want to toggle the permission for.
     * @param {string} vehicleId - The vehicle's ID.
     * @returns The return value is a boolean.
     */
    static async toggleVehicleRankPermission(player: alt.Player, rank: string, vehicleId: string) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.rankPermissions.manageVehicles) {
                return false;
            }
        }

        return await FactionFuncs.toggleVehicleRankPermission(faction, rank, vehicleId);
    }

    /**
     * If the player is the owner or admin, or if the player's rank has the vehicleId in the vehicles
     * array, then spawn the vehicle
     * @param player - alt.Player - The player who is spawning the vehicle.
     * @param {string} vehicleId - The vehicle ID that you want to spawn.
     * @returns a boolean value.
     */
    static async spawnVehicle(player: alt.Player, vehicleId: string) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return false;
        }

        if (!faction.vehicles || !Array.isArray(faction.vehicles)) {
            return false;
        }

        const vehicleIndex = faction.vehicles.findIndex((x) => x.id === vehicleId);
        if (vehicleIndex <= -1) {
            return false;
        }

        if (!FactionPlayerFuncs.isOwnerOrAdmin(player)) {
            // Get the current acting member's rank.
            const selfRank = FactionFuncs.getFactionMemberRank(faction, player.data._id);
            if (!selfRank.vehicles) {
                return false;
            }

            if (selfRank.vehicles.findIndex((x) => x === vehicleId) <= -1) {
                return false;
            }
        }

        if (!faction.settings.parkingSpots || !Array.isArray(faction.settings.parkingSpots)) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return false;
        }

        if (faction.settings.parkingSpots.length <= 0) {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
            return false;
        }

        const sortedSpots = faction.settings.parkingSpots.sort((a, b) => {
            return distance(player.pos, a.pos) - distance(player.pos, b.pos);
        });

        return await FactionFuncs.spawnVehicle(faction, vehicleId, sortedSpots[0]);
    }

    /**
     * Invoke an event by an event name.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} functionName
     * @param {...any[]} args
     * @return {*}
     * @memberof FactionPlayerFuncs
     */
    static invoke(player: alt.Player, functionName: string, ...args: any[]): boolean {
        console.log(`invoking...`);
        console.log(functionName, JSON.stringify(args));

        if (!FactionPlayerFuncs[functionName]) {
            return false;
        }

        console.log('invoked');
        return FactionPlayerFuncs[functionName](player, ...args);
    }
}

alt.onClient(FACTION_EVENTS.PROTOCOL.INVOKE, FactionPlayerFuncs.invoke);
