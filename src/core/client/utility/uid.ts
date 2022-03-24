export class UID {
    /**
     * Generates a UID based on string characters in the English alphabet.
     *
     * @static
     * @return {*}  {string}
     * @memberof UID
     */
    static generate(): string {
        return (
            String.fromCharCode(Math.floor(Math.random() * 26) + 97) +
            Math.random().toString(16).slice(2) +
            Date.now().toString(16).slice(4)
        );
    }
}
