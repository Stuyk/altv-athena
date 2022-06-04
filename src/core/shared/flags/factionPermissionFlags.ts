/**
 * Changing these numerical values can ruin your faction(s).
 * Keep the default(s) but add additional below it.
 * It's a bitwise permission structure.
 * Just look at the number(s) and discover the pattern.
 * @export
 * @enum {number}
 */
export enum FACTION_PERMISSION_FLAGS {
    SUPER_ADMIN = 1, // Skips all permission checks.
    CHANGE_NAME = 2, // Changes the name of the faction.
    CHANGE_MEMBER_RANK = 4, // Changes member rank if lower.
    CHANGE_RANK_ORDER = 8, // Change the rank order. Can only go 1 lower than current rank.
    CHANGE_RANK_NAMES = 16, // Change rank name if lower than current rank.
    KICK_MEMBER = 32, // Kick members lower than current rank
    CREATE_RANK = 64, // Create a new rank. Always starts as lowest.
    PREVENT_FACTION_CHAT = 128, // Prevents chatting in /f
    ACCESS_STORAGE = 256, // A place to store money and store items
    ADD_TO_BANK = 512, // Add money to the faction bank.
    REMOVE_FROM_BANK = 1024, // Remove money from the faction bank.
    ACCESS_WEAPONS = 2048, // A place to store money, items, and weapons.
    ADD_MEMBERS = 4096, // Permission to add members to the faction.
    CHANGE_RANK_PERMS = 8192, // Permission to change rank permission(s). Really strong. Careful.
}

export enum FACTION_STORAGE {
    STORAGE = 'storage',
    WEAPONS = 'weapons',
}
