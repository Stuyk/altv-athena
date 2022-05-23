import { ITEM_TYPE } from '../../../../shared/enums/itemTypes';
import { CUFF_EFFECTS } from '../../shared/effects';
import { CUFF_ITEM_DB_NAMES } from '../../shared/items';

export const CuffItems = [
    {
        name: `Cuffs`,
        description: `A pair of handcuffs`,
        dbName: CUFF_ITEM_DB_NAMES.CUFFS,
        icon: 'cuffs',
        slot: 0,
        quantity: 1,
        behavior:
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE |
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.SKIP_CONSUMABLE |
            ITEM_TYPE.DESTROY_ON_DROP,
        data: {
            event: CUFF_EFFECTS.CUFF,
        },
        version: 1,
    },
    {
        name: `Cuffs Key`,
        description: `Manage a cuffed user with this key.`,
        dbName: CUFF_ITEM_DB_NAMES.KEY,
        icon: 'cuffskey',
        slot: 0,
        quantity: 1,
        behavior:
            ITEM_TYPE.IS_TOOLBAR |
            ITEM_TYPE.CONSUMABLE |
            ITEM_TYPE.CAN_DROP |
            ITEM_TYPE.SKIP_CONSUMABLE |
            ITEM_TYPE.DESTROY_ON_DROP,
        data: {
            event: CUFF_EFFECTS.MANAGE,
        },
        version: 1,
    },
];
