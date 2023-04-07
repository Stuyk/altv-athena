export interface SlotInfo {
    slot: number;
    location: 'inventory' | 'toolbar' | 'custom';
    hasItem: boolean;
    quantity: number;
    name: string;
    totalWeight: number;
    highlight?: boolean;
}
