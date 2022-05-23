import { CLOTHING_STORE_PAGE } from '../../shared/enums';

export const DEFAULT_CLOTHING_STORE = {
    uid: 'clothing-store-0',
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
        [CLOTHING_STORE_PAGE.ACCESSORY]: 900,
    },
    clothingPrices: {
        // [CLOTHING_STORE_PAGE.ARMOUR]: Array<{ price: number; id: number; }>
        [CLOTHING_STORE_PAGE.HATS]: [{ id: 0, price: 50000 }],
    },
};
