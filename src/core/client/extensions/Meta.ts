import { Appearance } from '../../shared/interfaces/Appearance';
import { Item } from '../../shared/interfaces/Item';
import { Vehicle } from '../../shared/interfaces/Vehicle';

export interface Meta {
    permissionLevel: number; // Used to determine the player's current permissionLevel as a player..
    isDead: boolean; // Used to determine when a player is dead or not.
    gridSpace: number; // Used to identify what part of the map the player is on. Based on Y Axis.

    // Currency
    bank: number;
    cash: number;

    // Food & Water
    food: number;
    water: number;

    // Player Info
    appearance: Appearance;

    // Inventory
    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;

    // Vehicles
    vehicles: Array<Vehicle>;
}
