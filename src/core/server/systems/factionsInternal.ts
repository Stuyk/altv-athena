import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { View_Events_Factions } from '../../shared/enums/views';
import { FACTION_PERMISSION_FLAGS, FACTION_STORAGE } from '../../shared/flags/factionPermissionFlags';
import { FactionMember, FactionRank, IFaction } from '../../shared/interfaces/iFaction';
import { FactionMemberClient, FactionRankClient, IFactionClient } from '../../shared/interfaces/iFactionClient';
import { IResponse } from '../../shared/interfaces/iResponse';
import { IVehicle } from '../../shared/interfaces/iVehicle';
import { Vector3 } from '../../shared/interfaces/vector';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance2d } from '../../shared/utility/vector';
import { DEFAULT_CONFIG } from '../athena/main';
import { playerFuncs } from '../extensions/extPlayer';
import VehicleFuncs from '../extensions/vehicleFuncs';
import { Collections } from '../interface/iDatabaseCollections';
import Logger from '../utility/athenaLogger';
import { StorageView } from '../views/storage';
import { ServerBlipController } from './blip';
import { FactionSystem } from './factions';
import { InteractionController } from './interaction';
import { ServerMarkerController } from '../streamers/marker';
import { StorageSystem } from './storage';

let factions: { [key: string]: IFaction } = {};
let openFactionInterfaces: { [faction: string]: Array<alt.Player> } = {};

/**
 * Feature List:
 * *set faction name
 * *add member
 * *remove member
 * *add rank
 * *set member rank
 * *remove rank
 * *change rank order
 * *change rank name
 * *change rank permission
 * *storage access (supports 'bank', 'storage', and 'weapons')
 * *remove from bank
 * *add to bank
 * refresh menu for players who have it open
 */

export class FactionInternalSystem {
    static async init() {
        const factions = await Database.fetchAllData(Collections.Factions);
        if (!factions || !Array.isArray(factions)) {
            Logger.warning(`You have not created any factions.`);
            return;
        }

        for (let i = 0; i < factions.length; i++) {
            FactionInternalSystem.setup(factions[i]);
        }
    }

    /**
     * Create a Faction
     * @static
     * @param {IFaction} faction
     * @memberof FactionInternalSystem
     */
    static async create(player: alt.Player, faction: IFaction): Promise<boolean> {
        if (player.data.faction) {
            return false;
        }

        faction.pos = player.pos;
        faction.players = [{ name: player.data.name, id: player.data._id.toString(), rank: 0 }];

        const newFaction = await Database.insertData(faction, Collections.Factions, true);
        newFaction._id = newFaction._id.toString();
        player.data.faction = newFaction._id.toString();
        playerFuncs.save.field(player, 'faction', newFaction._id);
        await FactionInternalSystem.setup(faction);
        return true;
    }

    /**
     * It removes all the blips and interactions for a faction, and then adds them back.
     * @param {string} faction - The name of the faction.
     * @param {boolean} doNotRefresh - This is a boolean that determines whether or not the blip and
    interaction will be refreshed.
     * @returns The faction object.
     */
    static async refreshBlipsAndInteractions(faction: string, doNotRefresh: boolean = false) {
        if (!factions[faction]) {
            return;
        }

        const blipName = `${faction}-blip`;
        const storageName = `${faction}-storage`;
        const weaponsName = `${faction}-weapons`;

        // Storage
        InteractionController.remove(storageName);
        ServerMarkerController.remove(storageName);

        // Weapons
        InteractionController.remove(weaponsName);
        ServerMarkerController.remove(weaponsName);

        // Blip
        ServerBlipController.remove(blipName);

        if (doNotRefresh) {
            return;
        }

        if (factions[faction].storageLocation) {
            InteractionController.add({
                uid: storageName,
                description: `Access Faction Storage`,
                position: factions[faction].storageLocation,
                data: [FACTION_STORAGE.STORAGE],
                callback: FactionSystem.openStorage,
                isPlayerOnly: true,
            });

            ServerMarkerController.append({
                uid: storageName,
                pos: factions[faction].storageLocation,
                type: 1,
                color: new alt.RGBA(255, 255, 255, 100),
            });
        }

        if (factions[faction].weaponLocation) {
            InteractionController.add({
                uid: weaponsName,
                description: `Access Faction Weapons`,
                position: factions[faction].weaponLocation,
                data: [FACTION_STORAGE.WEAPONS],
                callback: FactionSystem.openStorage,
                isPlayerOnly: true,
            });

            ServerMarkerController.append({
                uid: weaponsName,
                pos: factions[faction].weaponLocation,
                type: 1,
                color: new alt.RGBA(255, 255, 255, 100),
            });
        }

        if (factions[faction].pos) {
            ServerBlipController.append({
                uid: blipName,
                pos: factions[faction].pos,
                color: 9,
                sprite: 478,
                scale: 1,
                shortRange: true,
                text: factions[faction].name,
                identifier: blipName,
            });
        }
    }

    /**
     * Take over a faction as an Admin.
     * @static
     * @param {alt.Player} player
     * @memberof FactionInternalSystem
     */
    static async takeOverFaction(player: alt.Player, faction: string): Promise<boolean> {
        if (!factions[faction]) {
            return false;
        }

        const owner = factions[faction].players[0];
        if (owner.id === player.data._id.toString()) {
            return false;
        }

        factions[faction].players[0].rank = 1;
        factions[faction].players.unshift({ id: player.data._id.toString(), name: player.data.name, rank: 0 });
        await FactionInternalSystem.save(faction, { players: factions[faction].players });
        return true;
    }

    /**
     * Hand over a faction to a player in the faction.
     * The owner will leave the faction if this is done.
     * @static
     * @param {alt.Player} player
     * @memberof FactionInternalSystem
     */
    static async handOffFaction(
        faction: string,
        characterID: string,
        leaveFaction: boolean = false,
    ): Promise<IResponse> {
        if (!factions[faction]) {
            return { status: false, response: 'Faction does not exist.' };
        }

        if (factions[faction].players[0].id === characterID) {
            return { status: false, response: 'You are already the owner of the faction.' };
        }

        const targetIndex = factions[faction].players.findIndex((x) => x.id === characterID);
        if (targetIndex <= -1) {
            return { status: false, response: `Target player is not in faction.` };
        }

        const newOwner = factions[faction].players.splice(targetIndex, 1)[0];

        if (leaveFaction) {
            factions[faction].players.splice(0, 1);
        } else {
            factions[faction].players[0].rank = 1;
        }

        newOwner.rank = 0;
        factions[faction].players.unshift(newOwner);
        await FactionInternalSystem.save(faction, { players: factions[faction].players });
        return { status: true, response: `Changed faction ownership to ${newOwner.name}` };
    }

    /**
     * Disband, reset all member's factions, and delete faction.
     * Notifies all online players.
     * @static
     * @param {string} faction
     * @return {*}
     * @memberof FactionInternalSystem
     */
    static async disband(faction: string): Promise<void> {
        if (!factions[faction]) {
            return;
        }

        const factionName = factions[faction].name;

        // Delete / Remove Blips, Markers, etc.
        FactionInternalSystem.refreshBlipsAndInteractions(factionName, true);

        await Database.updateDataByFieldMatch('faction', faction, { faction: null }, Collections.Characters);
        const openInterfacePlayers = openFactionInterfaces[faction];
        alt.Player.all.forEach((player) => {
            if (!player && !player.data && !player.data.faction) {
                return;
            }

            if (player.data.faction !== faction) {
                return;
            }

            if (openInterfacePlayers.findIndex((x) => x.id === player.id) >= 0) {
                alt.emitClient(player, View_Events_Factions.Close);
            }

            player.data.faction = null;
            playerFuncs.emit.notification(player, `${factionName} was disbanded.`);
        });

        await Database.deleteById(faction, Collections.Factions);

        delete factions[faction];
        delete openFactionInterfaces[faction];
        Logger.warning(`${factionName} was disbanded.`);
    }

    /**
     * Player Log(s)
     * Only logs the last 50 messages.
     * @static
     * @param {string} factionID
     * @param {string} whoDoneIt
     * @param {boolean} status
     * @param {string} response
     * @memberof FactionInternalSystem
     */
    static async log(factionID: string, characterID: string, status: boolean, response: string) {
        if (!factions[factionID]) {
            return;
        }

        const member = factions[factionID].players.find((x) => x.id === characterID);
        if (!member) {
            return;
        }

        if (!factions[factionID].logs) {
            factions[factionID].logs = [];
        }

        if (factions[factionID].logs.length >= DEFAULT_CONFIG.MAX_LOG_LENGTH) {
            factions[factionID].logs.pop();
        }

        factions[factionID].logs.unshift(
            `[${new Date(Date.now()).toISOString()}] ${member.name} - ${status} - ${response}`,
        );

        FactionInternalSystem.save(factionID, { logs: factions[factionID].logs });
    }

    /**
     * Get a faction from cache.
     * @static
     * @param {string} id
     * @return {*}
     * @memberof FactionInternalSystem
     */
    static get(id: string): IFaction {
        return factions[id];
    }

    /**
     * Finds a faction by partial id
     * @static
     * @param {string} partialID
     * @return {(IFaction | null)}
     * @memberof FactionInternalSystem
     */
    static find(partialID: string): IFaction | null {
        const keys = Object.keys(factions);
        const key = keys.find((x) => x.toLocaleLowerCase().includes(partialID.toLowerCase()));

        if (!key) {
            return null;
        }

        return factions[key];
    }

    /**
     * Get all vehicles that belong to a faction.
     * @static
     * @param {string} id
     * @return {*}
     * @memberof FactionInternalSystem
     */
    static async getAllVehicles(id: string): Promise<IVehicle[]> {
        return await Database.fetchAllByField(`owner`, id, Collections.Vehicles);
    }

    /**
     * Finds a faction by name.
     * @static
     * @param {string} name
     * @return {(IFaction | null)}
     * @memberof FactionInternalSystem
     */
    static findByName(name: string): IFaction | null {
        let matchingIdentifier;

        Object.keys(factions).forEach((identifier) => {
            const faction = factions[identifier];

            if (faction.name.toLowerCase().includes(name.toLowerCase())) {
                matchingIdentifier = identifier;
            }
        });

        if (!matchingIdentifier) {
            return null;
        }

        return factions[matchingIdentifier];
    }

    /**
     * Returns all currently loaded factions.
     * @static
     * @return {Array<IFaction>}
     * @memberof FactionInternalSystem
     */
    static getAllFactions(): Array<IFaction> {
        const factionList = [];

        Object.keys(factions).forEach((identifier) => {
            const faction = factions[identifier];
            factionList.push(faction);
        });

        return factionList;
    }

    /**
     * Does general setup for the faction.
     * Also looks up vehicles and spawns them.
     * @static
     * @param {IFaction} faction
     * @memberof FactionSystem
     */
    static async setup(faction: IFaction) {
        faction._id = faction._id.toString();

        if (!faction.ranks) {
            faction.ranks = [
                {
                    name: 'Admin',
                    permissions: FACTION_PERMISSION_FLAGS.SUPER_ADMIN,
                },
                {
                    name: 'Moderator',
                    permissions:
                        FACTION_PERMISSION_FLAGS.KICK_MEMBER |
                        FACTION_PERMISSION_FLAGS.CHANGE_MEMBER_RANK |
                        FACTION_PERMISSION_FLAGS.ACCESS_STORAGE |
                        FACTION_PERMISSION_FLAGS.ACCESS_WEAPONS |
                        FACTION_PERMISSION_FLAGS.ADD_TO_BANK |
                        FACTION_PERMISSION_FLAGS.REMOVE_FROM_BANK |
                        FACTION_PERMISSION_FLAGS.KICK_MEMBER |
                        FACTION_PERMISSION_FLAGS.ADD_MEMBERS,
                },
                {
                    name: 'Goon',
                    permissions:
                        FACTION_PERMISSION_FLAGS.ACCESS_STORAGE |
                        FACTION_PERMISSION_FLAGS.ACCESS_WEAPONS |
                        FACTION_PERMISSION_FLAGS.ADD_TO_BANK,
                },
            ];
        }

        if (faction.bank === undefined || faction.bank === null) {
            faction.bank = 0;
        }

        factions[faction._id as string] = faction;

        const factionVehicles = await Database.fetchAllByField<IVehicle>('_id', faction._id, Collections.Vehicles);
        if (factionVehicles.length >= 1) {
            for (let i = 0; i < factionVehicles.length; i++) {
                const vehicle = factionVehicles[i];
                VehicleFuncs.spawn(vehicle);
            }
        }

        FactionInternalSystem.refreshBlipsAndInteractions(faction._id.toString());
    }

    static refresh(id: string) {
        if (!factions[id]) {
            return;
        }

        if (!openFactionInterfaces[id]) {
            return;
        }

        const players = [...openFactionInterfaces[id]];

        for (let i = 0; i < players.length; i++) {
            if (!players[i] || !players[i].valid) {
                continue;
            }

            if (!players[i].data || !players[i].data.faction) {
                continue;
            }

            const clientInterface = FactionInternalSystem.getClientInterface(
                players[i].data.faction,
                players[i].data._id.toString(),
            );

            alt.emitClient(players[i], View_Events_Factions.Update, clientInterface);
        }
    }

    static opened(player: alt.Player) {
        if (!player.data.faction) {
            return;
        }

        if (!openFactionInterfaces[player.data.faction]) {
            openFactionInterfaces[player.data.faction] = [];
        }

        const index = openFactionInterfaces[player.data.faction].findIndex((p) => p.id);
        if (index >= 0) {
            return;
        }

        openFactionInterfaces[player.data.faction].push(player);
    }

    static closed(player: alt.Player) {
        if (!player.data.faction) {
            return;
        }

        if (!openFactionInterfaces[player.data.faction]) {
            openFactionInterfaces[player.data.faction] = [];
        }

        for (var i = openFactionInterfaces[player.data.faction].length - 1; i >= 0; i--) {
            if (!openFactionInterfaces[player.data.faction][i]) {
                openFactionInterfaces[player.data.faction].splice(i, 1);
                continue;
            }

            if (!openFactionInterfaces[player.data.faction][i].valid) {
                openFactionInterfaces[player.data.faction].splice(i, 1);
                continue;
            }

            if (openFactionInterfaces[player.data.faction][i].id !== player.id) {
                continue;
            }

            openFactionInterfaces[player.data.faction].splice(i, 1);
            break;
        }
    }

    /**
     * Save part of faction data to the database.
     * @static
     * @param {string} id
     * @param {Partial<IFaction>} data
     * @return {Promise<boolean>}
     * @memberof FactionSystem
     */
    private static async save(id: string, data: Partial<IFaction>): Promise<boolean> {
        FactionInternalSystem.refresh(id);
        return await Database.updatePartialData(id, { ...data }, Collections.Factions);
    }

    /**
     * Validate if player data is currently valid.
     * Checks for faction validity and player validity.
     * @private
     * @static
     * @param {alt.Player} player
     * @return {IResponse}
     * @memberof FactionSystem
     */
    static validatePlayer(player: alt.Player): IResponse {
        if (!player || !player.valid || !player.data.faction) {
            return { status: false, response: 'You are not currently in a faction.' };
        }

        if (!factions[player.data.faction]) {
            player.data.faction = null;
            playerFuncs.save.field(player, 'faction', null);
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        return { status: true, response: null };
    }

    /**
     * Get the member from the faction if it exists.
     * @static
     * @param {string} id
     * @param {string} characterID
     * @return {FactionMember | null}
     * @memberof FactionSystem
     */
    static getMember(id: string, characterID: string): FactionMember {
        return factions[id].players.find((member) => member.id === characterID);
    }

    /**
     * Get the rank associated with a faction member.
     * @static
     * @param {string} id
     * @param {FactionMember} member
     * @return {FactionRank | null}
     * @memberof FactionSystem
     */
    static getRankFromMember(id: string, member: FactionMember): FactionRank {
        return factions[id].ranks[member.rank];
    }

    /**
     * Internal function to check if the player has the specified permission(s)
     * @static
     * @param {string} id The faction id of a player
     * @param {string} playerID The character id of a player
     * @param {FACTION_PERMISSION_FLAGS} flag
     * @return {Promise<IResponse>}
     * @memberof FactionSystem
     */
    static hasPermission(id: string, characterID: string, flags: FACTION_PERMISSION_FLAGS): IResponse {
        const member = FactionInternalSystem.getMember(id, characterID);
        const rank = FactionInternalSystem.getRankFromMember(id, member);

        if (isFlagEnabled(rank.permissions, FACTION_PERMISSION_FLAGS.SUPER_ADMIN)) {
            return { status: true, response: 'Completed Action' };
        }

        const result = isFlagEnabled(rank.permissions, flags);
        if (!result) {
            return { status: result, response: 'You do not have permission to perform this action.' };
        }

        return { status: result, response: 'Completed action.' };
    }

    /**
     * Raw Permission Check
     * @static
     * @param {FACTION_PERMISSION_FLAGS} permissions
     * @param {FACTION_PERMISSION_FLAGS} flags
     * @return {*}  {boolean}
     * @memberof FactionInternalSystem
     */
    static checkPermission(permissions: FACTION_PERMISSION_FLAGS, flags: FACTION_PERMISSION_FLAGS): boolean {
        if (isFlagEnabled(permissions, FACTION_PERMISSION_FLAGS.SUPER_ADMIN)) {
            return true;
        }

        return isFlagEnabled(permissions, flags);
    }

    /**
     * Internal callable function to add a member to the faction.
     * @static
     * @param {string} id
     * @param {alt.Player} target
     * @return {*}  {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async addMember(id: string, target: alt.Player): Promise<IResponse> {
        if (!target || !target.valid || !target.data) {
            return { status: false, response: 'Target player does not exist.' };
        }

        if (!factions[id]) {
            return { status: false, response: 'The faction ID specified does not exist.' };
        }

        const memberIndex = factions[id].players.findIndex((member) => member.id === target.data._id.toString());
        if (memberIndex >= 0) {
            return { status: true, response: `${target.data.name} is already in this faction.` };
        }

        const lastRankInFaction = factions[id].ranks.length - 1;

        factions[id].players.push({ id: target.data._id.toString(), name: target.data.name, rank: lastRankInFaction });
        target.data.faction = id;
        await playerFuncs.save.field(target, 'faction', target.data.faction);
        await this.save(id, { players: factions[id].players });
        return { status: true, response: `${target.data.name} was added to the faction.` };
    }

    /**
     * Internal callable function to remove a member from this faction based on their character id.
     * @static
     * @param {string} factionID
     * @param {string} characterID
     * @return {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async removeMember(factionID: string, characterID: string): Promise<IResponse> {
        if (!factions[factionID]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        const memberIndex = factions[factionID].players.findIndex((member) => member.id === characterID);
        if (memberIndex <= -1) {
            return { status: false, response: 'Target player is not in your faction.' };
        }

        const target = alt.Player.all.find((x) => x.data && x.data._id.toString() === characterID);
        if (target) {
            target.data.faction = null;
            await playerFuncs.save.field(target, 'faction', target.data.faction);
        }

        const oldData = factions[factionID].players.splice(memberIndex, 1)[0];
        await this.save(factionID, { players: factions[factionID].players });
        return { status: true, response: `${oldData.name} was removed from your faction.` };
    }

    /**
     * Internal callable function to change a members's rank.
     * @static
     * @param {string} id The ID of the faction.
     * @param {string} characterID The member id.
     * @param {rankIndex} rankIndex The index of the rank we are changing it to.
     * @return {Promise<boolean>}
     * @memberof FactionSystem
     */
    static async setMemberRank(id: string, characterID: string, rankIndex: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: 'The faction rank no longer exists.' };
        }

        const memberIndex = factions[id].players.findIndex((member) => member.id === characterID);
        if (memberIndex <= -1) {
            return { status: false, response: 'Target player is not in your faction.' };
        }

        if (Math.abs(factions[id].players[memberIndex].rank - rankIndex) > 1) {
            return { status: false, response: 'May only move rank up or down 1 index at a time.' };
        }

        factions[id].players[memberIndex].rank = rankIndex;
        await this.save(id, { players: factions[id].players });
        return { status: true, response: `${factions[id].players[memberIndex].name} rank was set to ${rankIndex}` };
    }

    /**
     * Internal callable function to add a rank to a faction.
     * @static
     * @param {string} id FactionID
     * @param {string} rankName Name of New Rank
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async addRank(id: string, rankName: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        factions[id].ranks.push({ name: rankName, permissions: 0 });
        await this.save(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank ${rankName} was created.` };
    }

    /**
     * Internal callable function to remove a rank based on index from a faction.
     * @static
     * @param {string} id FactionID
     * @param {number} rankIndex Index in Rank Array
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async removeRank(id: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (factions[id].ranks.length <= 2) {
            return { status: false, response: `You cannot remove any more ranks. Must always have 2.` };
        }

        // Get all the players who are in the last rank.
        // Decrease their rank by 1. Making them higher up.
        for (let i = 0; i < factions[id].players.length; i++) {
            if (factions[id].players[i].rank !== factions[id].ranks.length - 1) {
                continue;
            }

            factions[id].players[i].rank -= 1;
        }

        const oldRank = factions[id].ranks.pop();
        await this.save(id, { ranks: factions[id].ranks, players: factions[id].players });
        return { status: true, response: `Rank ${oldRank.name} was removed.` };
    }

    /**
     * Internal callable function to change the name of a rank.
     * @static
     * @param {string} id
     * @param {number} rankIndex
     * @param {string} name
     * @return {*}
     * @memberof FactionSystem
     */
    static async setRankName(id: string, rankIndex: number, name: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: `The rank index of ${rankIndex} does not exist.` };
        }

        const oldName = factions[id].ranks[rankIndex].name;
        factions[id].ranks[rankIndex].name = name;
        await this.save(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank ${oldName} was renamed to ${name}` };
    }

    /**
     * Change rank permissions.
     * @static
     * @param {string} id
     * @param {number} rankIndex
     * @param {number} flags
     * @return {*}
     * @memberof FactionSystem
     */
    static async setRankPermissions(id: string, rankIndex: number, flags: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: `The rank index of ${rankIndex} does not exist.` };
        }

        const oldFlags = factions[id].ranks[rankIndex].permissions;
        factions[id].ranks[rankIndex].permissions = flags;
        await this.save(id, { ranks: factions[id].ranks });
        return { status: true, response: `Rank ${rankIndex} had permissions changed from ${oldFlags} to ${flags}` };
    }

    /**
     * Internal callable function to set the name of a faction and save it to the database.
     * @static
     * @param {string} id FactionID
     * @param {string} name Name of Faction
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async setName(id: string, name: string): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        factions[id].name = name;
        await this.save(id, { name: factions[id].name });
        return { status: true, response: `Faction name was set to ${name}` };
    }

    /**
     * Internal function to change rank order(s).
     * Members will follow the direction of the rank move.
     * Move down implies adding 1 to a rank.
     * @static
     * @param {string} id
     * @param {number} rankIndex
     * @return {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async changeRankOrder(id: string, rankIndex: number, moveDown: boolean = false): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!factions[id].ranks[rankIndex]) {
            return { status: false, response: 'That rank does not exist.' };
        }

        if (factions[id].ranks.length - 1 === rankIndex && moveDown) {
            return { status: false, response: 'Cannot be moved down any further.' };
        }

        if ((0 === rankIndex || 1 === rankIndex) && !moveDown) {
            return { status: false, response: 'Cannot be moved up any further.' };
        }

        const name = factions[id].ranks[rankIndex].name;
        const aboveRankIndex = moveDown ? rankIndex + 1 : rankIndex - 1;

        for (let i = 0; i < factions[id].players.length; i++) {
            // If the player's rank matches the rank that is being swapped.
            // We either move this player up or down.
            // Swap all players who are currently this rank to this rank.
            if (factions[id].players[i].rank === aboveRankIndex) {
                factions[id].players[i].rank = rankIndex;
                continue;
            }

            // If the player's rank is the rank we are moving.
            // We either move this player up or down.
            // Move down implying we 'ADD' 1 to it.
            if (factions[id].players[i].rank === rankIndex) {
                factions[id].players[i].rank = aboveRankIndex;
                continue;
            }
        }

        const rankBeingMoved = factions[id].ranks.splice(rankIndex, 1)[0];
        factions[id].ranks.splice(aboveRankIndex, 0, rankBeingMoved);
        await this.save(id, { ranks: factions[id].ranks, players: factions[id].players });

        const verb = moveDown ? 'moved down' : 'moved up';
        return { status: true, response: `Faction Rank Order Changed. ${name} was ${verb}.` };
    }

    /**
     * Internal function to open a storage container for a player.
     * @static
     * @param {string} id FactionID
     * @param {string} storageName Name of Faction
     * @return {Promise<Response>}
     * @memberof FactionSystem
     */
    static async openStorage(player: alt.Player, id: string, storageName: FACTION_STORAGE): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (!Object.values(FACTION_STORAGE).includes(storageName)) {
            return { status: false, response: 'The storage specified does not exist.' };
        }

        let storageID: string;

        // Storage type corresponds with storageName specified.
        if (!factions[id][storageName]) {
            const storage = await StorageSystem.create({ cash: 0, items: [], maxSize: 128 });
            factions[id][storageName] = storage._id.toString();
            await this.save(id, { storage: storage._id.toString(), players: factions[id].players });
            storageID = factions[id][storageName];
        } else {
            storageID = factions[id][storageName].toString();
        }

        StorageView.open(player, storageID, `Faction - ${storageName.toUpperCase()}`);
        return { status: true, response: 'Storage was opened.' };
    }

    /**
     * Deposits money to a faction bank.
     * @static
     * @param {string} id
     * @param {number} amount
     * @return {*}  {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async depositToBank(id: string, amount: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (typeof amount === 'string') {
            amount = Math.floor(parseInt(amount));
        } else {
            amount = Math.floor(amount);
        }

        if (isNaN(amount)) {
            return { status: false, response: `${amount} is not a valid number.` };
        }

        if (!factions[id].bank) {
            factions[id].bank = 0;
        }

        factions[id].bank += Math.abs(amount);
        await this.save(id, { bank: factions[id].bank });
        return { status: true, response: `Deposited $${amount}` };
    }

    /**
     * Deposits money to a faction bank.
     * @static
     * @param {string} id
     * @param {number} amount
     * @return {*}  {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async withdrawFromBank(id: string, amount: number): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        if (typeof amount === 'string') {
            amount = Math.floor(parseInt(amount));
        } else {
            amount = Math.floor(amount);
        }

        if (isNaN(amount)) {
            return { status: false, response: `${amount} is not a valid number.` };
        }

        if (!factions[id].bank) {
            factions[id].bank = 0;
        }

        if (factions[id].bank < amount) {
            return { status: false, response: `Faction bank does not have $${amount} available.` };
        }

        factions[id].bank -= Math.abs(amount);
        await this.save(id, { bank: factions[id].bank });
        return { status: true, response: `Withdrew $${amount}` };
    }

    /**
     * Set the position of this faction.
     * @static
     * @param {string} id
     * @param {Vector3} position
     * @return {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async setPosition(id: string, position: Vector3): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        factions[id].pos = {
            x: position.x,
            y: position.y,
            z: position.z - 1,
        };

        await this.save(id, { pos: factions[id].pos });
        await this.refreshBlipsAndInteractions(id);
        return { status: true, response: `Faction Position Set to ${JSON.stringify(factions[id].pos)}` };
    }

    /**
     * Set the storage location of this faction.
     * Re-initializes interaction as well.
     * @static
     * @param {string} id
     * @param {Vector3} position
     * @return {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async setStorageLocation(id: string, position: Vector3): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        const dist = distance2d(factions[id].pos, position);
        if (dist >= 75) {
            return { status: false, response: `Your position is too far from central location.` };
        }

        factions[id].storageLocation = {
            x: position.x,
            y: position.y,
            z: position.z - 1,
        };

        await this.save(id, { storageLocation: factions[id].storageLocation });
        await this.refreshBlipsAndInteractions(id);
        return { status: true, response: `Faction Storage Location Set to ${JSON.stringify(factions[id].pos)}` };
    }

    /**
     * Set the weapons location of this faction.
     * Re-initializes interaction as well.
     * @static
     * @param {string} id
     * @param {Vector3} position
     * @return {Promise<IResponse>}
     * @memberof FactionInternalSystem
     */
    static async setWeaponsLocation(id: string, position: Vector3): Promise<IResponse> {
        if (!factions[id]) {
            return { status: false, response: 'The faction you are in no longer exists.' };
        }

        const dist = distance2d(factions[id].pos, position);
        if (dist >= 75) {
            return { status: false, response: `Your position is too far from central location.` };
        }

        factions[id].weaponLocation = {
            x: position.x,
            y: position.y,
            z: position.z - 1,
        };

        await this.save(id, { weaponLocation: factions[id].weaponLocation });
        await this.refreshBlipsAndInteractions(id);
        return { status: true, response: `Faction Weapons Location Set to ${JSON.stringify(factions[id].pos)}` };
    }

    /**
     * Constructs a faction object for use on client-side.
     * This faction object helps display different parts of the interface.
     * Use this as reference if you make any changes to the interface in the future.
     * @static
     * @param {string} id
     * @param {string} playerID
     * @return {IFactionClient}
     * @memberof FactionInternalSystem
     */
    static getClientInterface(id: string, playerID: string): IFactionClient {
        if (!factions[id]) {
            return null;
        }

        const faction = factions[id];
        const player = factions[id].players.find((p) => p.id === playerID);

        if (!player) {
            return null;
        }

        const playerRank = factions[id].ranks[player.rank];
        const canChangeMemberRanks = FactionInternalSystem.checkPermission(
            playerRank.permissions,
            FACTION_PERMISSION_FLAGS.CHANGE_MEMBER_RANK,
        );

        const canChangeRankName = FactionInternalSystem.checkPermission(
            playerRank.permissions,
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_NAMES,
        );

        const canChangeRankOrder = FactionInternalSystem.checkPermission(
            playerRank.permissions,
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_ORDER,
        );

        const canKickMembers = FactionInternalSystem.checkPermission(
            playerRank.permissions,
            FACTION_PERMISSION_FLAGS.KICK_MEMBER,
        );

        const canCreateRanks = FactionInternalSystem.checkPermission(
            playerRank.permissions,
            FACTION_PERMISSION_FLAGS.CREATE_RANK,
        );

        const canChangeRankPerms = FactionInternalSystem.checkPermission(
            playerRank.permissions,
            FACTION_PERMISSION_FLAGS.CHANGE_RANK_PERMS,
        );

        const clientPlayers: Array<FactionMemberClient> = [];
        for (let i = 0; i < factions[id].players.length; i++) {
            const member = { ...factions[id].players[i] } as FactionMemberClient;

            if (canChangeMemberRanks && player.rank < member.rank) {
                if (player.rank < member.rank - 1) {
                    member.canRankUp = true;
                }

                if (member.rank !== factions[id].ranks.length - 1) {
                    member.canRankDown = true;
                }
            }

            if (canKickMembers && player.rank < member.rank) {
                member.canBeKicked = true;
            }

            clientPlayers.push(member);
        }

        const clientRanks: Array<FactionRankClient> = [];
        for (let i = 0; i < factions[id].ranks.length; i++) {
            const rank = { ...factions[id].ranks[i] } as FactionRankClient;
            if (canChangeRankName && player.rank < i) {
                rank.canRenameRank = true;
            }

            if (canChangeRankOrder && player.rank < i) {
                if (i !== factions[id].ranks.length - 1 && i !== 0) {
                    rank.canMoveRankDown = true;
                }

                if (i !== 0 && i !== 1 && player.rank < i - 1) {
                    rank.canMoveRankUp = true;
                }
            }

            // Basically; Check if last rank. Check that the faction rank length is at least 3.
            // If there are only 2 ranks in the faction it cannot remove another.
            if (canCreateRanks && i === factions[id].ranks.length - 1 && factions[id].ranks.length >= 3) {
                rank.canRemoveRank = true;
            }

            // Prevents changing own rank permissions.
            // However, only the owner can add the flag to change rank perms to a rank.
            if (canChangeRankPerms && player.rank < i) {
                rank.canChangeRankPerms = true;
            }

            clientRanks.push(rank);
        }

        const factionClient: IFactionClient = {
            _id: faction._id,
            clientID: playerID,
            logs: faction.logs,
            name: faction.name,
            pos: faction.pos,
            players: clientPlayers,
            ranks: clientRanks,
            canAddRanks: canCreateRanks,
            storageLocation: faction.storageLocation,
            weaponLocation: faction.weaponLocation,
            canAddToBank: FactionInternalSystem.checkPermission(
                playerRank.permissions,
                FACTION_PERMISSION_FLAGS.ADD_TO_BANK,
            ),
            canRemoveFromBank: FactionInternalSystem.checkPermission(
                playerRank.permissions,
                FACTION_PERMISSION_FLAGS.REMOVE_FROM_BANK,
            ),
            canChangeName: FactionInternalSystem.checkPermission(
                playerRank.permissions,
                FACTION_PERMISSION_FLAGS.CHANGE_NAME,
            ),
            bank: faction.bank,
            dimension: faction.dimension,
        };

        return factionClient;
    }
}

FactionInternalSystem.init();
