import { CLOTHING_IDS, ORIENTATION, PROP_IDS } from './enums';
import { IClothingConfig } from './interfaces';

export const CLOTHING_CONFIG: IClothingConfig = {
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_COMPONENT_VALUES: {
        // Female
        [ORIENTATION.FEMALE]: {
            [CLOTHING_IDS.MASKS]: 197, // Masks
            [CLOTHING_IDS.TORSOS]: 241, // Torsos
            [CLOTHING_IDS.LEGS]: 150, // Legs
            [CLOTHING_IDS.BAGS]: 99, // Bags
            [CLOTHING_IDS.SHOES]: 105, // Shoes
            [CLOTHING_IDS.ACCESSORIES]: 120, // Accessories
            [CLOTHING_IDS.UNDERSHIRTS]: 233, // Undershirts
            [CLOTHING_IDS.BODY_ARMOUR]: 18, // body armour
            [CLOTHING_IDS.TOP]: 414, // Tops / Shirts
        },
        // Male
        [ORIENTATION.MALE]: {
            [CLOTHING_IDS.MASKS]: 197, // Masks
            [CLOTHING_IDS.TORSOS]: 196, // Torsos
            [CLOTHING_IDS.LEGS]: 143, // Legs
            [CLOTHING_IDS.BAGS]: 99, // Bags
            [CLOTHING_IDS.SHOES]: 101, // Shoes
            [CLOTHING_IDS.ACCESSORIES]: 151, // Accessories
            [CLOTHING_IDS.UNDERSHIRTS]: 188, // Undershirts
            [CLOTHING_IDS.BODY_ARMOUR]: 16, // body armour
            [CLOTHING_IDS.TOP]: 392, // Tops / Shirts
        },
    },
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_PROP_VALUES: {
        [ORIENTATION.FEMALE]: {
            [PROP_IDS.HATS]: 162, // Hats
            [PROP_IDS.GLASSES]: 41, // Glasses
            [PROP_IDS.EARS]: 21, // Ears
            [PROP_IDS.WATCHES]: 29, // Watches
            [PROP_IDS.BRACELETS]: 15, // Bracelets
        },
        [ORIENTATION.MALE]: {
            [PROP_IDS.HATS]: 163, // Hats
            [PROP_IDS.GLASSES]: 39, // Glasses
            [PROP_IDS.EARS]: 40, // Ears
            [PROP_IDS.WATCHES]: 40, // Watches
            [PROP_IDS.BRACELETS]: 8, // Bracelets
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
