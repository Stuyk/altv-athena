/**
 * Returns the elements present in A
 * but are not present in B.
 * @export
 * @template T
 * @param {Array<T>} a
 * @param {Array<T>} b
 * @param {number} aLength
 * @param {number} bLength
 */
export function findMissingElements<T>(a: Array<T>, b: Array<T>, propertyName: string): Array<T> {
    let missing: Array<T> = [];

    for (let i = 0; i < b.length; i++) {
        // If 'A' array has element from 'B' array then it is not missing.
        if (a.findIndex((x) => x[propertyName] === b[i][propertyName]) >= 0) {
            continue;
        }

        missing.push(b[i]);
    }

    return missing;
}
