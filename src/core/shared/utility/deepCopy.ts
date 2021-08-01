/**
 * Used to deep clone an object and detach all references.
 * Does not work with functions.
 * This is required to prevent data from being modified in other items.
 * @export
 * @param {object} data
 * @return {*}
 */
export function deepCloneObject<T>(data: object): T {
    const result = JSON.parse(JSON.stringify(data));

    Object.keys(result).forEach((key) => {
        if (typeof result[key] === 'function') {
            delete result[key];
        }
    });

    return result;
}
