export enum ItemType {
    NONE = 0,
    CAN_DROP = 1,
    CAN_STACK = 2,
    CAN_TRADE = 4,
    IS_EQUIPMENT = 8,
    IS_TOOLBAR = 16,
    IS_WEAPON = 32,
    DESTROY_ON_DROP = 64,
    CONSUMABLE = 128,
    SKIP_CONSUMABLE = 256
}
