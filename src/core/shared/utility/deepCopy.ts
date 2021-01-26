/**
 * Used to deep clone an object and detach all references.
 * Does not work with functions.
 * This is required to prevent data from being modified in other items.
 * @export
 * @param {object} data
 * @return {*}
 */
export function deepCloneObject<T>(data: object): T {
    return JSON.parse(JSON.stringify(data));
}
