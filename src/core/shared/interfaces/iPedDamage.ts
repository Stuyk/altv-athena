import { Weapon } from "../information/weaponList";

export interface IPedDamage{
    weapon: Weapon,
    damage: number,
    bone: number
}