/**
 * Bitwise Flag Operation Rundown (Bitmask)
 * Basically you start at 0.
 * Starting at 1. You double the value for each enum entry against itself.
 * 0 = None
 * 1 = Something
 * 2 = Something Bigger
 * 4 = Something Greater
 * 8 = Something Bigger Than Greater
 * 16 = Something So Big It's Greater than Bigger
 *
 * Basically you keep doing this until you hit max bit mask integer limit.
 * Max Value: 4,294,967,295
 * Roughly 33 Entries Per Bitmask Enum
 */

/**
 * These Permissions are for Administrative Priviledges
 * They can be attached to commands.
 * Permissions are a group of bitwise flags that can be combined.
 * You can use isFlagEnabled to check if a flag is enabled.
 * Combine them to create a group of valid permissions.
 * These are not for jobs. Please don't use these for jobs.
 * Example: const modAdmin = Permissions.Moderator | Permissions.Admin;
 * @export
 * @enum {number}
 */
export enum Permissions {
    None = 0,
    VIP = 1,
    Moderator = 2,
    Admin = 4
    // Do Not Exceed 33 Entries
}

/**
 * These CharacterPermissions are Character Specific.
 * Great for assigning multiple character permissions such as jobs.
 * @export
 * @enum {number}
 */
export enum CharacterPermissions {
    None = 0
    // Do Not Exceed 33 Entries
}
