/**
 * Strips a string category into a number.
 * @export
 * @param {string} value 'e-1'
 * @return {*}  {number}
 */
export function stripCategory(value: string): number {
    return parseInt(value.replace(/.*-/gm, ''));
}
