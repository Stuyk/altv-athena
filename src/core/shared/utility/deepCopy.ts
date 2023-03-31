/**
 * Used to deep clone an object and detach all references.
 * Does not work with functions.
 * This is required to prevent data from being modified in other items.
 *
 * @param {object} data
 * @return {void}
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

/**
 * Makes a complete copy of an array and all objects.
 *
 *
 * @template T
 * @param {(Array<object | T>)} data
 * @return {Array<T>}
 */
export function deepCloneArray<T>(data: Array<object | T>): Array<T> {
    const newArray = [...data];
    for (let i = 0; i < newArray.length; i++) {
        newArray[i] = deepCloneObject<T>(newArray[i] as object);
    }

    return newArray as Array<T>;
}
