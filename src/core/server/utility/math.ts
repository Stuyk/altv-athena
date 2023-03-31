/**
 * Takes an array of numbers and attempts to determine which number is missing given a range.
 * Returns the first missing number.
 *
 *
 * @param {Array<number>} arr
 * @param {number} [startIndex=0]
 * @return {number}
 */
export function getMissingNumber(arr: Array<number>, startIndex = 0): number {
    if (arr.length <= 0) {
        return startIndex;
    }

    const count = arr.length;
    for (var i = startIndex; i <= count; i++) {
        if (arr.indexOf(i) == -1) {
            return i;
        }
    }

    return arr.length + 1;
}

export default { getMissingNumber };
