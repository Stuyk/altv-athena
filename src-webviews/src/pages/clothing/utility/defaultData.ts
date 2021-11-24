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
    // Do not change these; they're hard-coded.
    UNDERSHIRT = 90,
    TORSO = 91,
}

export default {
    hiddenComponents: {
        [CLOTHING_STORE_PAGE.HATS]: [-1, 0, 1],
    },
    hiddenPages: [CLOTHING_STORE_PAGE.ARMOUR],
    pagePrices: {
        [CLOTHING_STORE_PAGE.ARMOUR]: 900,
        [CLOTHING_STORE_PAGE.BAG]: 250,
        [CLOTHING_STORE_PAGE.BOTTOMS]: 50,
        [CLOTHING_STORE_PAGE.BRACELET]: 25,
        [CLOTHING_STORE_PAGE.EARRINGS]: 10,
        [CLOTHING_STORE_PAGE.GLASSES]: 50,
        [CLOTHING_STORE_PAGE.HATS]: 75,
        [CLOTHING_STORE_PAGE.MASK]: 250,
        [CLOTHING_STORE_PAGE.SHIRT]: 100,
        [CLOTHING_STORE_PAGE.SHOES]: 75,
        [CLOTHING_STORE_PAGE.WATCH]: 500,
    },
    clothingPrices: {
        // [CLOTHING_STORE_PAGE.ARMOUR]: Array<{ price: number; id: number; }>
        [CLOTHING_STORE_PAGE.HATS]: [{ id: 0, price: 50000 }],
    },
};
