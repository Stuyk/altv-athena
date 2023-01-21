export type InventoryType = 'inventory' | 'toolbar';

export interface DualSlotInfo {
    startType: InventoryType;
    startIndex: number;
    endType: InventoryType;
    endIndex: number;
}
