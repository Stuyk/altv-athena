import { Item } from '../../shared/interfaces/Item';

export interface Meta {
    permissionLevel: number; // Used to determine the player's current permissionLevel as a player..
    isDead: boolean; // Used to determine when a player is dead or not.
    gridSpace: number; // Used to identify what part of the map the player is on. Based on Y Axis.

    // Currency
    bank: number;
    cash: number;

    // Inventory
    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
}
