export function isFlagEnabled(flags: number, flagToCheck: number) {
    return (flags & flagToCheck) !== 0;
}
