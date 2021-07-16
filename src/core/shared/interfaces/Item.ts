import { EQUIPMENT_TYPE } from '../enums/equipmentTypes';
import { ITEM_TYPE } from '../enums/itemTypes';

export interface Item {
    name: string;
    uuid?: string;
    description: string;
    icon: string;
    quantity: number;
    behavior: ITEM_TYPE;
    slot?: number;
    hash?: string;
    equipment?: EQUIPMENT_TYPE;
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
