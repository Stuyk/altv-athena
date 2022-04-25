import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { sha256Random } from '../../../../server/utility/encryption';
import { StorageView } from '../../../../server/views/storage';
import { DefaultRanks } from '../../shared/defaultData';
import { Faction, FactionCore, FactionRank } from '../../shared/interfaces';
import { Character } from '../../../../shared/interfaces/character';
import { IGenericResponse } from '../../../../shared/interfaces/iResponse';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';
import { Athena } from '../../../../server/api/athena';

export const FACTION_COLLECTION = 'factions';
const factions: { [key: string]: Faction } = {};

class InternalFunctions {
    /**
     * Create the faction and add cache it to memory.
     *
     * @static
     * @param {Faction} faction
     * @memberof InternalFunctions
     */
    static create(faction: Faction) {
        faction._id = faction._id.toString();
        factions[faction._id as string] = faction;
    }
}

export class FactionHandler {
    /**
     * Initialize Factions on Startup
     *
     * @static
     * @memberof FactionCore
     */
    static async init() {
        const factions = await Database.fetchAllData<Faction>(FACTION_COLLECTION);

        if (factions.length <= 0) {
            alt.logWarning(`No Factions have been Created`);
            return;
        }

        for (let i = 0; i < factions.length; i++) {
            InternalFunctions.create(factions[i]);
        }

        // Used to initialize internal functions for factions.
        // factionFuncs.init();
    }

    /**
     * Add a faction and return a _id if created successfully added.
     *
     * @static
     * @param {alt.Player} player
     * @param {FactionCore} _faction
     * @return {Promise<IGenericResponse>} _id
     * @memberof FactionHandler
     */
    static async add(characterOwnerID: string, _faction: FactionCore): Promise<IGenericResponse<string>> {
        if (!_faction.name) {
            alt.logWarning(`Cannot create faction, missing faction name.`);
            return { status: false, response: `Cannot create faction, missing faction name.` };
        }

        if (_faction.bank === null || _faction.bank === undefined) {
            _faction.bank = 0;
        }

        const character = await Database.fetchData<Character>('_id', characterOwnerID, Collections.Characters);
        if (!character) {
            alt.logWarning(`Could not find a character with identifier: ${characterOwnerID}`);
            return { status: false, response: `Could not find a character with identifier: ${characterOwnerID}` };
        }

        if (character.faction) {
            return { status: false, response: `Character is already in a faction.` };
        }

        const defaultRanks = deepCloneObject<Array<FactionRank>>(DefaultRanks);
        for (let i = 0; i < defaultRanks.length; i++) {
            defaultRanks[i].uid = sha256Random(JSON.stringify(defaultRanks[i]));
        }

        const faction: Faction = {
            ..._faction,
            members: {
                [characterOwnerID]: {
                    id: characterOwnerID,
                    name: character.name,
                    rank: defaultRanks[0].uid,
                    hasOwnership: true,
                },
            },
            ranks: defaultRanks,
            vehicles: [],
            storages: [],
            actions: {},
            tickActions: [],
        };

        const document = await Database.insertData<Faction>(faction, FACTION_COLLECTION, true);
        if (!document) {
            alt.logWarning(`Cannot insert faction into database.`);
            return { status: false, response: `Cannot insert faction into database.` };
        }

        character.faction = document._id.toString();
        await Database.updatePartialData(
            character._id,
            {
                faction: character.faction,
            },
            Collections.Characters,
        );

        const target = alt.Player.all.find((x) => x && x.data && x.data._id.toString() === character._id.toString());
        if (target) {
            target.data.faction = character.faction;
        }

        InternalFunctions.create(document);
        return { status: false, response: document._id.toString() };
    }

    /**
     * Deletes the faction forever
     * Remove all players from the faction
     * Remove all vehicles from the faction (deleted)
     * Remove all storages from the faction (deleted)
     * Faction Bank is sent to owner of faction
     *
     * @static
     * @param {string} _id
     * @memberof FactionCore
     */
    static async remove(_id: string): Promise<IGenericResponse<string>> {
        // Find the faction...
        const faction = factions[_id];
        if (!faction) {
            return { status: false, response: `Faction was not found with id: ${_id}` };
        }

        // Remove the faction outright...
        const factionClone = deepCloneObject<Faction>(faction);
        delete factions[_id];

        // Fetch faction owner...
        const ownerIdentifier = await new Promise((resolve: Function) => {
            Object.keys(factionClone.members).forEach((key) => {
                if (!factionClone.members[key].hasOwnership) {
                    return;
                }

                return resolve(factionClone.members[key].id);
            });
        });

        // Clear all members...
        const members = await Database.fetchAllByField<Character>('faction', factionClone._id, Collections.Characters);
        let onlinePlayers: Array<alt.Player> = [];
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            member.faction = null;

            const player = alt.Player.all.find((p) => p.data && p.data._id === members[i]._id);
            if (player && player.valid) {
                player.data.faction = null;

                // Add bank balance to owner character
                if (player.data._id === ownerIdentifier) {
                    player.data.bank += factionClone.bank;
                    Athena.player.sync.currencyData(player);
                    Athena.player.save.field(player, 'bank', player.data.bank);
                    Athena.player.emit.notification(player, `+$${factionClone.bank}`);
                }

                onlinePlayers.push(player);
            }

            // For non-logged in character owner add bank balance
            if (!player && member._id === ownerIdentifier) {
                member.bank += factionClone.bank;
                await Database.updatePartialData(
                    member._id.toString(),
                    { faction: null, bank: member.bank },
                    Collections.Characters,
                );
                continue;
            }

            // Remove faction from character
            await Database.updatePartialData(member._id.toString(), { faction: null }, Collections.Characters);
        }

        // Clear all vehicles...
        for (let i = 0; i < factionClone.vehicles.length; i++) {
            const vehicleId = factionClone.vehicles[i];
            const vehicle = alt.Vehicle.all.find((v) => v && v.valid && v.data && v.data._id === vehicleId);

            if (vehicle) {
                vehicle.destroy();
            }

            await Database.deleteById(vehicleId, Collections.Vehicles);
        }

        // Force close storage...
        for (let i = 0; i < onlinePlayers.length; i++) {
            if (!onlinePlayers[i] || !onlinePlayers[i].valid) {
                continue;
            }

            StorageView.close(onlinePlayers[i]);
        }

        // Delete storage...
        if (factionClone.storages && Array.isArray(factionClone.storages)) {
            for (let i = 0; i < factionClone.storages.length; i++) {
                const storageId = factionClone.storages[i];
                Database.deleteById(storageId, Collections.Storage);
            }
        }

        return { status: true, response: `Deleted faction successfully` };
    }

    /**
     * Used to update faction data, and automatically propogate changes for
     * users with faction panel open.
     *
     * @static
     * @param {string} _id
     * @param {Partial<Faction>} partialObject
     * @return {Promise<IGenericResponse<string>>}
     * @memberof FactionCore
     */
    static async update(_id: string, partialObject: Partial<Faction>): Promise<IGenericResponse<string>> {
        const faction = factions[_id];
        if (!faction) {
            return { status: false, response: `Faction was not found with id: ${_id}` };
        }

        Object.keys(faction).forEach((key) => {
            if (!partialObject[key]) {
                return;
            }

            faction[key] = partialObject[key];
        });

        await Database.updatePartialData(faction._id, partialObject, FACTION_COLLECTION);
        return { status: true, response: `Updated Faction Data` };
    }

    /**
     * Get faction data by identifier...
     *
     * @static
     * @param {string} _id
     * @return {Faction}
     * @memberof FactionCore
     */
    static get(_id: string): Faction {
        return factions[_id];
    }

    /**
     * Find a faction by name.
     *
     * @static
     * @param {string} nameOrPartialName
     * @return {*}  {(Faction | null)}
     * @memberof FactionCore
     */
    static find(nameOrPartialName: string): Faction | null {
        let faction: Faction;

        nameOrPartialName = nameOrPartialName.replace(/ /g, '').toLowerCase();

        const factionsList = Object.values(faction) as Array<Faction>;
        const index = factionsList.findIndex((f) => {
            const adjustedName = f.name.replace(/ /g, '').toLowerCase();
            if (adjustedName.includes(nameOrPartialName)) {
                return true;
            }

            return false;
        });

        if (index <= -1) {
            return null;
        }

        return factionsList[index];
    }

    /**
     * Return an array of all factions
     *
     * @static
     * @return {*}
     * @memberof FactionCore
     */
    static getAllFactions() {
        return Object.values(factions) as Array<Faction>;
    }
}
