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
export function findMissingElements<T>(a: Array<T>, b: Array<T>, aLength: number, bLength: number): Array<T> {
    let missing: Array<T> = [];
    let s = new Set();
    for (let i = 0; i < bLength; i++) {
        s.add(b[i]);
    }

    for (let i = 0; i < aLength; i++) {
        if (s.has(a[i])) {
            continue;
        }

        missing.push(a[i]);
    }

    return missing;
}
