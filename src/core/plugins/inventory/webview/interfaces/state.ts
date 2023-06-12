import { Item } from '@AthenaShared/interfaces/item';

export type TargetLocation = 'inventory' | 'ground' | 'storage' | 'toolbar';

export interface InterfaceState {
    inspector?: boolean;
    proximity?: boolean;
    context?: boolean;
    tooltip?: boolean;
    split?: boolean;
}

export interface InventoryState {
    x?: number;
    y?: number;
    item?: Item;
    contextOptions?: string[];
    target?: TargetLocation;
    dragging: boolean;
    interfaces: InterfaceState;
}
