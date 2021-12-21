import { FactionMember, FactionRank, IFaction } from './iFaction';

export interface FactionMemberClient extends FactionMember {
    /**
     * Can this player be ranked up by this player.
     * Always 1 less than player's current rank.
     * @type {boolean}
     * @memberof FactionMemberClient
     */
    canRankUp?: boolean;

    /**
     * Can this player be deranked by this player.
     * @type {boolean}
     * @memberof FactionMemberClient
     */
    canRankDown?: boolean;

    /**
     * Checks the flags, current member rank, etc. if they can kick.
     * @type {boolean}
     * @memberof FactionMemberClient
     */
    canBeKicked?: boolean;
}

export interface FactionRankClient extends FactionRank {
    /**
     * Can this player move this rank order up.
     * @type {boolean}
     * @memberof FactionRankClient
     */
    canMoveRankUp?: boolean;

    /**
     * Can this player move this rank order down.
     * @type {boolean}
     * @memberof FactionRankClient
     */
    canMoveRankDown?: boolean;

    /**
     * Used to remove the last rank in a rank list.
     * Must not have any players with this rank.
     * @type {boolean}
     * @memberof FactionRankClient
     */
    canRemoveRank?: boolean;

    /**
     * Can the player with the right permission rename this rank.
     * Can only be the same rank as them or lower.
     * @type {boolean}
     * @memberof FactionRankClient
     */
    canRenameRank?: boolean;

    /**
     * Can the player change the rank permission(s).
     * The player can append every permission but change rank perm(s).
     * Only the owner can append change rank perm(s).
     * @type {boolean}
     * @memberof FactionRankClient
     */
    canChangeRankPerms?: boolean;
}

export interface IFactionClient extends IFaction {
    /**
     * Overwrites the Player(s) List
     * @type {Array<IFactionMemberClient>}
     * @memberof IFactionClient
     */
    players: Array<FactionMemberClient>;

    /**
     * This is the current player who is receiving this data's ID.
     * @type {string}
     * @memberof IFactionClient
     */
    clientID: string;

    /**
     * Can this player add ranks?
     * @type {boolean}
     * @memberof IFactionClient
     */
    canAddRanks?: boolean;

    /**
     * Can deposit cash to faction bank.
     * @type {boolean}
     * @memberof IFactionClient
     */
    canAddToBank?: boolean;

    /**
     * Can remove cash from faction bank.
     * @type {boolean}
     * @memberof IFactionClient
     */
    canRemoveFromBank?: boolean;

    /**
     * Can change the faction name?
     * @type {boolean}
     * @memberof IFactionClient
     */
    canChangeName?: boolean;
}
