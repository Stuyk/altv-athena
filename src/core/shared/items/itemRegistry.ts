import { ItemType } from '../enums/itemType';
import { Item } from '../interfaces/Item';

export const ItemRegistry: Array<Item> = [
    {
        name: `Burger`,
        description: `A delicious burger that packs your arteries.`,
        icon: 'burger',
        slot: 0,
        quantity: 1,
        weight: 1,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE,
        data: {
            event: 'effect:Heal',
            heal: 5,
            sound: 'item_eat'
        }
    },
    {
        name: `Bread`,
        description: `An entire loaf of bread. It has 5 slices.`,
        icon: 'bread',
        slot: 0,
        quantity: 5,
        weight: 2,
        behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.CONSUMABLE,
        data: {
            event: 'effect:Heal',
            heal: 3,
            sound: 'item_eat'
        }
    }
];
