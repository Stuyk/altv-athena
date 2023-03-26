import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Get the width of the MiniMap
 * @static
 * @param {boolean} [asPercent=false] Convert to percentage?
 * @return {number}
 *
 */
export function getWidth(asPercent = false): number {
    const aspectRatio = getScreenAspectRatio();
    const resolution = getScreenResolution();
    const result = resolution.x / (4 * aspectRatio);

    if (asPercent) {
        return convertToPercentage(result, true);
    }

    return result;
}

/**
 * Get the height of the MiniMap
 * @static
 * @param {boolean} [asPercent=false] Convert to percentage?
 * @return {number}
 *
 */
export function getHeight(asPercent = false): number {
    const resolution = getScreenResolution();
    const result = resolution.y / 5.674;

    if (asPercent) {
        return convertToPercentage(result, false);
    }

    return result;
}

/**
 * Get the Top Left of the MiniMap
 * @static
 * @param {boolean} [asPercent=false] Convert to percentage?
 * @return {void}
 *
 */
export function getTopLeft(asPercent = false): alt.IVector2 {
    const resolution = getScreenResolution();
    const safeZone = getSafeZoneSize();
    const height = getHeight();

    const x = resolution.x * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10));
    const y = resolution.y - resolution.y * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10)) - height;

    if (asPercent) {
        return { x: convertToPercentage(x, true), y: convertToPercentage(y, false) };
    }

    return { x, y };
}

/**
 * Get the top right of the MiniMap
 * @static
 * @param {boolean} [asPercent=false]  Convert to percentage?
 * @return {void}
 *
 */
export function getTopRight(asPercent = false): alt.IVector2 {
    const { x, y } = getTopLeft();

    if (asPercent) {
        return {
            x: convertToPercentage(x + getWidth(), true),
            y: convertToPercentage(y, false),
        };
    }

    return { x: x + getWidth(), y };
}

/**
 * Get bottom left of the MiniMap
 * @static
 * @param {boolean} [asPercent=false] Convert to percentage?
 * @return {void}
 *
 */
export function getBottomLeft(asPercent = false): alt.IVector2 {
    const { x, y } = getTopLeft();

    if (asPercent) {
        return {
            x: convertToPercentage(x, true),
            y: convertToPercentage(y + getHeight(), false),
        };
    }

    return { x, y: y + getHeight() };
}

/**
 * Get Bottom Right of MiniMap
 * @static
 * @param {boolean} [asPercent=false] Conver to percentage?
 * @return {void}
 *
 */
export function getBottomRight(asPercent = false): alt.IVector2 {
    const { x, y } = getTopLeft();

    if (asPercent) {
        return {
            x: convertToPercentage(x + getWidth(), true),
            y: convertToPercentage(y + getHeight(), false),
        };
    }

    return { x: x + getWidth(), y: y + getHeight() };
}

export function getSafeZoneSize(): number {
    return native.getSafeZoneSize();
}

export function getScreenAspectRatio(): number {
    return native.getAspectRatio(false);
}

/**
 * Get current screen resolution
 *
 *
 * @return {alt.IVector2}
 */
export function getScreenResolution(): alt.IVector2 {
    const [_, x, y] = native.getActualScreenResolution(0, 0);
    return { x, y };
}

/**
 * Convert Pixel Values to Percentages
 * @static
 * @param {number} value
 * @param {boolean} [isXAxis=true]
 * @return {number}
 *
 */
export function convertToPercentage(value: number, isXAxis = true): number {
    const screen = getScreenResolution();

    if (isXAxis) {
        return value / screen.x;
    }

    return value / screen.y;
}
