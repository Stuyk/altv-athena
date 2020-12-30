type Flags = Permissions;

/**
 * Verify if a bitwise flag is enabled.
 * @export
 * @param {number} flags
 * @param {number} flagToCheck
 * @return {boolean}
 */
export function isFlagEnabled(flags: Flags | number, flagToCheck: Flags | number): boolean {
    let currentFlags: number = flags as number;
    let currentFlagToCheck: number = flagToCheck as number;

    if ((currentFlags & currentFlagToCheck) !== 0) {
        return true;
    }

    return false;
}
