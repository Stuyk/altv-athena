export const DLC_CLOTHING = {
    MALE: {
        MASKS: 0,
        TORSOS: 0,
        LEGS: 0,
        BAGS: 0,
        SHOES: 0,
        ACCESSORIES: 0,
        UNDERSHIRTS: 0,
        BODY_ARMOUR: 0,
        TOPS: 0,
        HATS: 0,
        GLASSES: 0,
        EARS: 0,
        WATCHES: 0,
        BRACELETS: 0,
    },
    FEMALE: {
        MASKS: 0,
        TORSOS: 0,
        LEGS: 0,
        BAGS: 0,
        SHOES: 0,
        ACCESSORIES: 0,
        UNDERSHIRTS: 0,
        BODY_ARMOUR: 0,
        TOPS: 0,
        HATS: 0,
        GLASSES: 0,
        EARS: 0,
        WATCHES: 0,
        BRACELETS: 0,
    },
};

export const CLOTHING_CONFIG = {
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_COMPONENT_VALUES: {
        // Male
        1: {
            1: 197 + DLC_CLOTHING.MALE.MASKS, // Masks
            3: 196 + DLC_CLOTHING.MALE.TORSOS, // Torsos
            4: 143 + DLC_CLOTHING.MALE.LEGS, // Legs
            5: 99 + DLC_CLOTHING.MALE.BAGS, // Bags
            6: 101 + DLC_CLOTHING.MALE.SHOES, // Shoes
            7: 151 + DLC_CLOTHING.MALE.ACCESSORIES, // Accessories
            8: 188 + DLC_CLOTHING.MALE.UNDERSHIRTS, // Undershirts
            9: 16 + DLC_CLOTHING.MALE.BODY_ARMOUR, // body armour
            11: 392 + DLC_CLOTHING.MALE.TOPS, // Tops / Shirts
        },
        // Female
        0: {
            1: 197 + DLC_CLOTHING.FEMALE.MASKS, // Masks
            3: 241 + DLC_CLOTHING.FEMALE.LEGS, // Torsos
            4: 150 + DLC_CLOTHING.FEMALE.LEGS, // Legs
            5: 99 + DLC_CLOTHING.FEMALE.BAGS, // Bags
            6: 105 + DLC_CLOTHING.FEMALE.SHOES, // Shoes
            7: 120 + DLC_CLOTHING.FEMALE.ACCESSORIES, // Accessories
            8: 233 + DLC_CLOTHING.FEMALE.UNDERSHIRTS, // Undershirts
            9: 18 + DLC_CLOTHING.FEMALE.BODY_ARMOUR, // body armour
            11: 414 + DLC_CLOTHING.FEMALE.TOPS, // Tops / Shirts
        },
    },
    /**
     * Adjusting this may result in game crashing. Use with caution.
     */
    MAXIMUM_PROP_VALUES: {
        1: {
            0: 163 + DLC_CLOTHING.MALE.HATS, // Hats
            1: 39 + DLC_CLOTHING.MALE.GLASSES, // Glasses
            2: 40 + DLC_CLOTHING.MALE.EARS, // Ears
            6: 40 + DLC_CLOTHING.MALE.WATCHES, // Watches
            7: 8 + DLC_CLOTHING.MALE.BRACELETS, // Bracelets
        },
        0: {
            0: 162 + DLC_CLOTHING.FEMALE.HATS, // Hats
            1: 41 + DLC_CLOTHING.FEMALE.GLASSES, // Glasses
            2: 21 + DLC_CLOTHING.FEMALE.EARS, // Ears
            6: 29 + DLC_CLOTHING.FEMALE.WATCHES, // Watches
            7: 15 + DLC_CLOTHING.FEMALE.BRACELETS, // Bracelets
        },
    },
};
