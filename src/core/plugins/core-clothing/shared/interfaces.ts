import { CLOTHING_IDS, CLOTHING_STORE_PAGE, ORIENTATION, PROP_IDS } from './enums';

export interface IClothingPrice {
    price: number;
    id: number;
}

export interface IClothingStore {
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

export interface CLOTHING_DLC_INFO {
    /**
     * The name of the dlc.
     * Should not include mp_m_ or mp_f_
     *
     * @type {string}
     * @memberof CLOTHING_DLC_INFO
     */
    dlcName: string;

    /**
     * Total count of drawables per orientation.
     *
     * If your female character has 5 masks available. Set it to 5.
     * If your male character has 3 masks available. Set it to 3.
     *
     * @type {{ [ORIENTATION.FEMALE]: number; [ORIENTATION.MALE]: number; }}
     * @memberof CLOTHING_DLC_INFO
     */
    count: {
        [ORIENTATION.FEMALE]: number;
        [ORIENTATION.MALE]: number;
    };
}

export interface CLOTHING_DLC {
    [key: string]: Array<CLOTHING_DLC_INFO>;
}

export interface IClothingConfig {
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_COMPONENT_VALUES: {
        // Female
        0: {
            [CLOTHING_IDS.MASKS]: number;
            [CLOTHING_IDS.TORSOS]: number;
            [CLOTHING_IDS.LEGS]: number;
            [CLOTHING_IDS.BAGS]: number;
            [CLOTHING_IDS.SHOES]: number;
            [CLOTHING_IDS.ACCESSORIES]: number;
            [CLOTHING_IDS.UNDERSHIRTS]: number;
            [CLOTHING_IDS.BODY_ARMOUR]: number;
            [CLOTHING_IDS.TOP]: number;
        };
        // Male
        1: {
            [CLOTHING_IDS.MASKS]: number;
            [CLOTHING_IDS.TORSOS]: number;
            [CLOTHING_IDS.LEGS]: number;
            [CLOTHING_IDS.BAGS]: number;
            [CLOTHING_IDS.SHOES]: number;
            [CLOTHING_IDS.ACCESSORIES]: number;
            [CLOTHING_IDS.UNDERSHIRTS]: number;
            [CLOTHING_IDS.BODY_ARMOUR]: number;
            [CLOTHING_IDS.TOP]: number;
        };
    };
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_PROP_VALUES: {
        [ORIENTATION.FEMALE]: {
            [PROP_IDS.HATS]: number;
            [PROP_IDS.GLASSES]: number;
            [PROP_IDS.EARS]: number;
            [PROP_IDS.WATCHES]: number;
            [PROP_IDS.BRACELETS]: number;
        };
        [ORIENTATION.MALE]: {
            [PROP_IDS.HATS]: number;
            [PROP_IDS.GLASSES]: number;
            [PROP_IDS.EARS]: number;
            [PROP_IDS.WATCHES]: number;
            [PROP_IDS.BRACELETS]: number;
        };
    };
    DLC_CLOTHING: {
        [CLOTHING_IDS.MASKS]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.TORSOS]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.LEGS]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.BAGS]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.SHOES]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.ACCESSORIES]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.UNDERSHIRTS]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.BODY_ARMOUR]: Array<CLOTHING_DLC_INFO>;
        [CLOTHING_IDS.TOP]: Array<CLOTHING_DLC_INFO>;
    };
    DLC_PROPS: {
        [PROP_IDS.HATS]: Array<CLOTHING_DLC_INFO>;
        [PROP_IDS.GLASSES]: Array<CLOTHING_DLC_INFO>;
        [PROP_IDS.EARS]: Array<CLOTHING_DLC_INFO>;
        [PROP_IDS.WATCHES]: Array<CLOTHING_DLC_INFO>;
        [PROP_IDS.BRACELETS]: Array<CLOTHING_DLC_INFO>;
    };
}
