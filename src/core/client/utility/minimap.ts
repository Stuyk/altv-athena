import * as native from 'natives';
import { Vector2 } from '../../shared/interfaces/vector';

export default class Minimap {
    /**
     * Get the width of the MiniMap
     * @static
     * @param {boolean} [asPercent=false] Convert to percentage?
     * @return {number}
     * @memberof Minimap
     */
    static getMinimapWidth(asPercent = false): number {
        const aspectRatio = Minimap.getScreenAspectRatio();
        const resolution = Minimap.getScreenResolution();
        const result = resolution.x / (4 * aspectRatio);

        if (asPercent) {
            return Minimap.convertToPercentage(result, true);
        }

        return result;
    }

    /**
     * Get the height of the MiniMap
     * @static
     * @param {boolean} [asPercent=false] Convert to percentage?
     * @return {number}
     * @memberof Minimap
     */
    static getMinimapHeight(asPercent = false): number {
        const resolution = Minimap.getScreenResolution();
        const result = resolution.y / 5.674;

        if (asPercent) {
            return Minimap.convertToPercentage(result, false);
        }

        return result;
    }

    /**
     * Get the Top Left of the MiniMap
     * @static
     * @param {boolean} [asPercent=false] Convert to percentage?
     * @return {*}
     * @memberof Minimap
     */
    static getMinimapTopLeft(asPercent = false): Vector2 {
        const resolution = Minimap.getScreenResolution();
        const safeZone = Minimap.getSafeZoneSize();
        const height = Minimap.getMinimapHeight();

        const x = resolution.x * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10));
        const y = resolution.y - resolution.y * ((1.0 / 20.0) * (Math.abs(safeZone - 1.0) * 10)) - height;

        if (asPercent) {
            return { x: Minimap.convertToPercentage(x, true), y: Minimap.convertToPercentage(y, false) };
        }

        return { x, y };
    }

    /**
     * Get the top right of the MiniMap
     * @static
     * @param {boolean} [asPercent=false]  Convert to percentage?
     * @return {*}
     * @memberof Minimap
     */
    static getMinimapTopRight(asPercent = false): Vector2 {
        const { x, y } = Minimap.getMinimapTopLeft();

        if (asPercent) {
            return {
                x: Minimap.convertToPercentage(x + Minimap.getMinimapWidth(), true),
                y: Minimap.convertToPercentage(y, false),
            };
        }

        return { x: x + Minimap.getMinimapWidth(), y };
    }

    /**
     * Get bottom left of the MiniMap
     * @static
     * @param {boolean} [asPercent=false] Convert to percentage?
     * @return {*}
     * @memberof Minimap
     */
    static getMinimapBottomLeft(asPercent = false): Vector2 {
        const { x, y } = Minimap.getMinimapTopLeft();

        if (asPercent) {
            return {
                x: Minimap.convertToPercentage(x, true),
                y: Minimap.convertToPercentage(y + Minimap.getMinimapHeight(), false),
            };
        }

        return { x, y: y + Minimap.getMinimapHeight() };
    }

    /**
     * Get Bottom Right of MiniMap
     * @static
     * @param {boolean} [asPercent=false] Conver to percentage?
     * @return {*}
     * @memberof Minimap
     */
    static getMinimapBottomRight(asPercent = false): Vector2 {
        const { x, y } = Minimap.getMinimapTopLeft();

        if (asPercent) {
            return {
                x: Minimap.convertToPercentage(x + Minimap.getMinimapWidth(), true),
                y: Minimap.convertToPercentage(y + Minimap.getMinimapHeight(), false),
            };
        }

        return { x: x + Minimap.getMinimapWidth(), y: y + Minimap.getMinimapHeight() };
    }

    static getSafeZoneSize(): number {
        return native.getSafeZoneSize();
    }

    static getScreenAspectRatio(): number {
        return native.getAspectRatio(false);
    }

    static getScreenResolution(): Vector2 {
        const [_, x, y] = native.getActiveScreenResolution(0, 0);
        return { x, y };
    }

    /**
     * Convert Pixel Values to Percentages
     * @static
     * @param {number} value
     * @param {boolean} [isXAxis=true]
     * @return {*}  {number}
     * @memberof Minimap
     */
    static convertToPercentage(value: number, isXAxis = true): number {
        const screen = Minimap.getScreenResolution();

        if (isXAxis) {
            return value / screen.x;
        }

        return value / screen.y;
    }
}
