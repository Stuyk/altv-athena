export type InventoryType = 'inventory' | 'toolbar' | 'custom';

export interface DualSlotInfo {
    startType: InventoryType;
    startIndex: number;
    endType: InventoryType;
    endIndex: number;
}
