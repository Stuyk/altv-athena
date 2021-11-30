import { CLOTHING_STORE_PAGE } from '../enums/ClothingStorePages';
import IClothingPrice from './IClothingPrice';

export default interface IClothingStore {
    /**
     * A unique identifier for a clothing store.
     * Usually automatically generated.
     * @type {string}
     * @memberof IClothingStore
     */
    uid?: string;

    /**
     * The pages to hide in a clothing store.
     * An empty array automatically display's all pages.
     * @type {Array<number>}
     * @memberof IClothingStore
     */
    hiddenPages: Array<CLOTHING_STORE_PAGE>;

    /**
     * Used to make specific values in the clothing store unavailable.
     * They can be see on the player but they cannot be purchased.
     * @type {{
     *         [CLOTHING_STORE_PAGE.ARMOUR]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.BAG]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.BOTTOMS]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.BRACELET]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.EARRINGS]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.GLASSES]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.HATS]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.MASK]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.SHIRT]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.SHOES]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.TORSO]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.UNDERSHIRT]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.WATCH]?: Array<number>;
     *         [CLOTHING_STORE_PAGE.ACCESSORY]?: Array<number>;
     *     }}
     * @memberof IClothingStore
     */
    hiddenComponents: {
        [CLOTHING_STORE_PAGE.ARMOUR]?: Array<number>;
        [CLOTHING_STORE_PAGE.BAG]?: Array<number>;
        [CLOTHING_STORE_PAGE.BOTTOMS]?: Array<number>;
        [CLOTHING_STORE_PAGE.BRACELET]?: Array<number>;
        [CLOTHING_STORE_PAGE.EARRINGS]?: Array<number>;
        [CLOTHING_STORE_PAGE.GLASSES]?: Array<number>;
        [CLOTHING_STORE_PAGE.HATS]?: Array<number>;
        [CLOTHING_STORE_PAGE.MASK]?: Array<number>;
        [CLOTHING_STORE_PAGE.SHIRT]?: Array<number>;
        [CLOTHING_STORE_PAGE.SHOES]?: Array<number>;
        [CLOTHING_STORE_PAGE.TORSO]?: Array<number>;
        [CLOTHING_STORE_PAGE.UNDERSHIRT]?: Array<number>;
        [CLOTHING_STORE_PAGE.WATCH]?: Array<number>;
        [CLOTHING_STORE_PAGE.ACCESSORY]?: Array<number>;
    };

    /**
     * Generalized clothing prices for specific pages.
     * If no clothing price is defined it defaults to this.
     * @type {{
     *         [CLOTHING_STORE_PAGE.ARMOUR]?: number;
     *         [CLOTHING_STORE_PAGE.BAG]?: number;
     *         [CLOTHING_STORE_PAGE.BOTTOMS]?: number;
     *         [CLOTHING_STORE_PAGE.BRACELET]?: number;
     *         [CLOTHING_STORE_PAGE.EARRINGS]?: number;
     *         [CLOTHING_STORE_PAGE.GLASSES]?: number;
     *         [CLOTHING_STORE_PAGE.HATS]?: number;
     *         [CLOTHING_STORE_PAGE.MASK]?: number;
     *         [CLOTHING_STORE_PAGE.SHIRT]?: number;
     *         [CLOTHING_STORE_PAGE.SHOES]?: number;
     *         [CLOTHING_STORE_PAGE.WATCH]?: number;
     *         [CLOTHING_STORE_PAGE.ACCESSORY]?: number;
     *     }}
     * @memberof IClothingStore
     */
    pagePrices: {
        [CLOTHING_STORE_PAGE.ARMOUR]?: number;
        [CLOTHING_STORE_PAGE.BAG]?: number;
        [CLOTHING_STORE_PAGE.BOTTOMS]?: number;
        [CLOTHING_STORE_PAGE.BRACELET]?: number;
        [CLOTHING_STORE_PAGE.EARRINGS]?: number;
        [CLOTHING_STORE_PAGE.GLASSES]?: number;
        [CLOTHING_STORE_PAGE.HATS]?: number;
        [CLOTHING_STORE_PAGE.MASK]?: number;
        [CLOTHING_STORE_PAGE.SHIRT]?: number;
        [CLOTHING_STORE_PAGE.SHOES]?: number;
        [CLOTHING_STORE_PAGE.WATCH]?: number;
        [CLOTHING_STORE_PAGE.ACCESSORY]?: number;
    };

    /**
     * Used to define individual prices for individual clothing items.
     * @type {{
     *         [CLOTHING_STORE_PAGE.ARMOUR]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.BAG]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.BOTTOMS]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.BRACELET]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.EARRINGS]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.GLASSES]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.HATS]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.MASK]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.SHIRT]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.SHOES]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.WATCH]?: Array<IClothingPrice>;
     *         [CLOTHING_STORE_PAGE.ACCESSORY]?: Array<IClothingPrice>;
     *     }}
     * @memberof IClothingStore
     */
    clothingPrices: {
        [CLOTHING_STORE_PAGE.ARMOUR]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.BAG]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.BOTTOMS]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.BRACELET]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.EARRINGS]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.GLASSES]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.HATS]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.MASK]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.SHIRT]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.SHOES]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.WATCH]?: Array<IClothingPrice>;
        [CLOTHING_STORE_PAGE.ACCESSORY]?: Array<IClothingPrice>;
    };
}
