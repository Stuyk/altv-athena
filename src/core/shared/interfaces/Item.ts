import { EquipmentType } from '../enums/equipment';
import { ItemType } from '../enums/itemType';

export interface Item {
    name: string;
    uuid?: string;
    description: string;
    icon: string;
    quantity: number;
    behavior: ItemType;
    slot?: number;
    hash?: string;
    equipment?: EquipmentType;
    data: { [key: string]: any };
}

export interface ItemSpecial extends Item {
    dataName: string;
    dataIndex: number;
    dataTab?: number;
    isInventory: boolean;
    isEquipment: boolean;
    isToolbar: boolean;
}

export interface DroppedItem {
    item: Item;
    position: { x: number; y: number; z: number };
    gridSpace: number;
    dimension: number;
}
