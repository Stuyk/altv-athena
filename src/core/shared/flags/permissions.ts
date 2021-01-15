/**
 * Permissions are a group of bitwise flags that can be combined.
 * You can use isFlagEnabled to check if a flag is enabled.
 * Combine them to create a group of valid permissions.
 * Example: const modAdmin = Permissions.Moderator | Permissions.Admin;
 * @export
 * @enum {number}
 */
export enum Permissions {
    None = 0,
    VIP = 1,
    Moderator = 2,
    Admin = 4
}
