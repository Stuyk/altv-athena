export class AthenaBuffer {
    /**
     * Create a String Buffer from a string.
     * Splits huge strings into a larger array.
     * @static
     * @param {string} data
     * @param {number} size
     * @return {Array<string>}
     * @memberof AthenaBuffer
     */
    static toBuffer(data: string, size: number = 512): Array<string> {
        const stringMatch = new RegExp(`.{1,${size}}`, 'g');
        return data.match(stringMatch);
    }

    /**
     * Turns a buffer into a string.
     * @static
     * @param {Array<string>} data
     * @return {string}
     * @memberof AthenaBuffer
     */
    static fromBuffer(data: Array<string>): string {
        return data.join('');
    }
}
