import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { Item } from '../../../../../shared/interfaces/item';

export const utility: Array<Item> = [
    {
        name: `Repair Kit`,
        description: `A toolkit to repair a vehicle.`,
        dbName: 'repair-kit',
        icon: 'toolbox',
        slot: 0,
        quantity: 1,
        behavior:
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.CAN_TRADE |
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE |
            ITEM_TYPE.SKIP_CONSUMABLE,
        data: {
            event: 'effect:Vehicle:Repair',
        },
        version: 1,
    },
];
