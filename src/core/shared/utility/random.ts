import * as alt from 'alt-shared';

/**
 * Get a random number between min and max (max excluded)
 * @param {number} minimum
 * @param {number} maximum
 * @returns {number}
 */
export function randomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Get a random number between min and max (max included)
 * @param {number} minimum
 * @param {number} maximum
 * @returns {number}
 */
export function randomNumberBetweenInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get a random color excluding alpha
 * @returns {alt.RGBA}
 */
export function getRandomRGB(alpha = 255): alt.RGBA {
    const r = randomNumberBetween(0, 255);
    const g = randomNumberBetween(0, 255);
    const b = randomNumberBetween(0, 255);
    return new alt.RGBA(r, g, b, alpha);
}

/**
 * Get a random color including random alpha
 * @returns {alt.RGBA}
 */
export function getRandomRGBA(): alt.RGBA {
    const r = randomNumberBetween(0, 255);
    const g = randomNumberBetween(0, 255);
    const b = randomNumberBetween(0, 255);
    const a = randomNumberBetween(0, 255);
    return new alt.RGBA(r, g, b, a);
}

/**
 * Shuffle an array, and return randomized order.
 *
 *
 * @template T
 * @param {Array<T>} array
 * @return {Array<T>}
 */
export function shuffle<T>(array: Array<T>): Array<T> {
    let currentIndex = array.length;
    let randomIndex: number;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

/**
 * Return a random value from an array of values
 *
 *
 * @template T
 * @param {Array<T>} elements
 * @return {T}
 */
export function getRandomElement<T>(elements: Array<T>): T {
    const index = Math.floor(Math.random() * elements.length);
    return elements[index];
}
