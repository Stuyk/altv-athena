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
