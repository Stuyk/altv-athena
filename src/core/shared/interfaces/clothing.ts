/**
 * Represents a Clothing Item / Component
 * Used to determine what to draw on a character.
 * @export
 * @interface ClothingComponent
 */
export interface ClothingComponent {
    /**
     * The custom name of the clothing set by the player.
     * @type {string}
     * @memberof ClothingComponent
     */
    name: string;

    /**
     * The combination ids to use on the component.
     * Loops through each id and applies matching drawables.
     * Must be the same length as other array items.
     * @type {Array<number>}
     * @memberof ClothingComponent
     */
    ids: Array<number>;

    /**
     * What the clothing item will look like.
     * It's an internal identifier.
     * Must be the same length as other array items.
     * @type {Array<number>}
     * @memberof ClothingComponent
     */
    drawables: Array<number>;

    /**
     * The textures that will be applied with the drawable.
     * It's an internal identifier.
     * Must be the same length as other array items.
     * @type {Array<number>}
     * @memberof ClothingComponent
     */
    textures: Array<number>;

    /**
     * Mark the clothing component as a prop.
     * Which uses a different set of prop identifier.
     * @type {boolean}
     * @memberof ClothingComponent
     */
    isProp: boolean;

    /**
     * What player model is this built for.
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    sex?: number;

    /**
     * The page which this component belongs to inside of the shop system.
     * @type {number}
     * @memberof ClothingComponent
     */
    internalID?: number;

    /**
     * For client-side usage. Do not set manually.
     * Calls the native and gets max drawables for an id.
     * @type {Array<number>}
     * @memberof ClothingComponent
     */
    maxDrawables?: Array<number>;

    /**
     * For client-side usage. Do not set manually.
     * Calls the native and gets max textures for a drawable id.
     * @type {Array<number>}
     * @memberof ClothingComponent
     */
    maxTextures?: Array<number>;

    /**
     * Current value that player is using.
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    startValue?: number;

    /**
     * The DLC Hash associated with this component.
     *
     * @type {number}
     * @memberof ClothingComponent
     */
    dlcHashes?: Array<number | string>;
}
