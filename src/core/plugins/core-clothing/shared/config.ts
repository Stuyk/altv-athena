import { CLOTHING_IDS, ORIENTATION, PROP_IDS } from './enums';
import { IClothingConfig } from './interfaces';

export const CLOTHING_CONFIG: IClothingConfig = {
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_COMPONENT_VALUES: {
        // Female
        [ORIENTATION.FEMALE]: {
            [CLOTHING_IDS.MASKS]: 208, // Masks
            [CLOTHING_IDS.TORSOS]: 242, // Torsos
            [CLOTHING_IDS.LEGS]: 155, // Legs
            [CLOTHING_IDS.BAGS]: 110, // Bags
            [CLOTHING_IDS.SHOES]: 112, // Shoes
            [CLOTHING_IDS.ACCESSORIES]: 122, // Accessories
            [CLOTHING_IDS.UNDERSHIRTS]: 235, // Undershirts
            [CLOTHING_IDS.BODY_ARMOUR]: 33, // body armour
            [CLOTHING_IDS.TOP]: 439, // Tops / Shirts
        },
        // Male
        [ORIENTATION.MALE]: {
            [CLOTHING_IDS.MASKS]: 208, // Masks
            [CLOTHING_IDS.TORSOS]: 197, // Torsos
            [CLOTHING_IDS.LEGS]: 147, // Legs
            [CLOTHING_IDS.BAGS]: 110, // Bags
            [CLOTHING_IDS.SHOES]: 108, // Shoes
            [CLOTHING_IDS.ACCESSORIES]: 153, // Accessories
            [CLOTHING_IDS.UNDERSHIRTS]: 190, // Undershirts
            [CLOTHING_IDS.BODY_ARMOUR]: 28, // body armour
            [CLOTHING_IDS.TOP]: 412, // Tops / Shirts
        },
    },
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_PROP_VALUES: {
        [ORIENTATION.FEMALE]: {
            [PROP_IDS.HATS]: 171, // Hats
            [PROP_IDS.GLASSES]: 42, // Glasses
            [PROP_IDS.EARS]: 22, // Ears
            [PROP_IDS.WATCHES]: 33, // Watches
            [PROP_IDS.BRACELETS]: 17, // Bracelets
        },
        [ORIENTATION.MALE]: {
            [PROP_IDS.HATS]: 172, // Hats
            [PROP_IDS.GLASSES]: 41, // Glasses
            [PROP_IDS.EARS]: 41, // Ears
            [PROP_IDS.WATCHES]: 44, // Watches
            [PROP_IDS.BRACELETS]: 9, // Bracelets
        },
    },
    DLC_CLOTHING: {
        // A word of warning before adding DLCs
        // The DLC order is **VERY IMPORTANT**
        // Make sure that your configuration in configs/prod, configs/dev, configs/devtest all match dlc order here.
        // Otherwise the wrong hash will be used for everything.
        // Always append to the bottom of the array. Never the top.
        [CLOTHING_IDS.MASKS]: [
            // This is the array
            // {
            //     This is the dlc name without the mp_f_ or mp_m_
            //     dlcName: 'athenaclothtest',
            //     These are the total drawables available in the dlc
            //     count: {
            //         How many female drawables are available
            //         [ORIENTATION.FEMALE]: 1,
            //         How many male drawables are available
            //         [ORIENTATION.MALE]: 1,
            //     },
            // },
        ],
        [CLOTHING_IDS.TORSOS]: [],
        [CLOTHING_IDS.LEGS]: [],
        [CLOTHING_IDS.BAGS]: [],
        [CLOTHING_IDS.SHOES]: [],
        [CLOTHING_IDS.ACCESSORIES]: [],
        [CLOTHING_IDS.UNDERSHIRTS]: [],
        [CLOTHING_IDS.BODY_ARMOUR]: [],
        [CLOTHING_IDS.TOP]: [],
    },
    DLC_PROPS: {
        [PROP_IDS.HATS]: [],
        [PROP_IDS.GLASSES]: [],
        [PROP_IDS.EARS]: [],
        [PROP_IDS.WATCHES]: [],
        [PROP_IDS.BRACELETS]: [],
    },
};
