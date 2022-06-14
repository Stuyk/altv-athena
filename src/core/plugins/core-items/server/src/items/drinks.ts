import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { Item } from '../../../../../shared/interfaces/item';
import EFFECTS from '../../../../../shared/enums/effects';

export const drinks: Array<Item> = [
    {
        name: `Water`,
        description: `A refreshing glass of water.`,
        dbName: 'water',
        icon: 'crate',
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
            event: EFFECTS.EFFECT_WATER,
            amount: 5,
            sound: 'item_drink',
        },
        version: 1,
    },
    {
        name: `Cola`,
        description: `A refreshing glass of cola.`,
        dbName: 'cola',
        icon: 'crate',
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
            event: EFFECTS.EFFECT_WATER,
            amount: 25,
            sound: 'item_drink',
        },
        version: 1,
    },
];
