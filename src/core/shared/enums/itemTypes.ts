export enum ITEM_TYPE {
    NONE = 0,
    CAN_DROP = 1, // Not Implemented
    CAN_STACK = 2, // No Longer Relevant
    CAN_TRADE = 4, // Not Implemented
    IS_EQUIPMENT = 8,
    IS_TOOLBAR = 16,
    IS_WEAPON = 32,
    DESTROY_ON_DROP = 64, // Not Implemented
    CONSUMABLE = 128,
    SKIP_CONSUMABLE = 256,
}
