import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { Item } from '../../../../../shared/interfaces/item';
import EFFECTS from '../../../../../shared/enums/effects';

export const food: Array<Item> = [
    {
        name: `Burger`,
        description: `A delicious burger that packs your arteries.`,
        dbName: 'burger',
        icon: 'burger',
        slot: 0,
        maxStack: 3,
        quantity: 1,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.CAN_STACK |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 5,
            sound: 'item_eat',
            testData: 'Hello World!',
        },
        version: 1,
    },
    {
        name: `Ultra Delicious Burger`,
        description: `An absurdly delicious burger.`,
        dbName: 'ultra-burger',
        icon: 'burger',
        slot: 0,
        quantity: 1,
        rarity: 5,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.CAN_STACK |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 25,
            sound: 'item_eat',
        },
        version: 1,
    },
    {
        name: `Bread`,
        description: `An entire loaf of bread. It has 5 slices.`,
        dbName: 'bread',
        icon: 'bread',
        slot: 0,
        quantity: 5,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.CAN_STACK |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE,
        data: {
            event: EFFECTS.EFFECT_FOOD,
            amount: 3,
            sound: 'item_eat',
        },
        version: 1,
    },
];
