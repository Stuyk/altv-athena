export enum ORIENTATION {
    FEMALE = 0,
    MALE = 1,
}

export enum CLOTHING_STORE_PAGE {
    HATS = 0,
    MASK = 1,
    SHIRT = 2,
    BOTTOMS = 3,
    SHOES = 4,
    GLASSES = 5,
    EARRINGS = 6,
    BAG = 7,
    ARMOUR = 8,
    WATCH = 9,
    BRACELET = 10,
    ACCESSORY = 11,
    // Do not change these; they're hard-coded.
    UNDERSHIRT = 90,
    TORSO = 91,
}

export enum CLOTHING_IDS {
    MASKS = 1,
    TORSOS = 3,
    LEGS = 4,
    BAGS = 5,
    SHOES = 6,
    ACCESSORIES = 7,
    UNDERSHIRTS = 8,
    BODY_ARMOUR = 9,
    TOP = 11,
}

export enum PROP_IDS {
    HATS = 0,
    GLASSES = 1,
    EARS = 2,
    WATCHES = 6,
    BRACELETS = 7,
}

export const DLC_CLOTH_HASH = {
    [ORIENTATION.FEMALE]: 'mp_f_',
    [ORIENTATION.MALE]: 'mp_m_',
};
