export default interface IMiniMap {
    /**
     * Width of the map as a percentage
     * @type {number}
     * @memberof IMiniMap
     */
    width: number;

    /**
     * Height of the map as a percentage
     * @type {number}
     * @memberof IMiniMap
     */
    height: number;

    /**
     * The left side of the map as a percentage
     * @type {number}
     * @memberof IMiniMap
     */
    left: number;

    /**
     * The right side of the map as a percentage
     * @type {number}
     * @memberof IMiniMap
     */
    right: number;

    /**
     * Top of the map as a percentage
     * @type {number}
     * @memberof IMiniMap
     */
    top: number;

    /**
     * Bottom of the map as a percentage
     * @type {number}
     * @memberof IMiniMap
     */
    bottom: number;

    xUnit: number;
    yUnit: number;
}
