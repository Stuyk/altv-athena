export interface SlotInfo {
    slot: number;
    location: 'inventory' | 'toolbar' | 'custom';
    hasItem: boolean;
    quantity: number;
    name: string;
    weight: number;
    highlight?: boolean;
}
