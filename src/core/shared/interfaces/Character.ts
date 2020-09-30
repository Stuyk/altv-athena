import { Vector3 } from 'alt-server';
import { Appearance } from './Appearance';

export interface Character {
    _id?: string;
    account_id: string;
    age: number;
    pos: Vector3;
    cash: number;
    bank: number;
    appearance: Partial<Appearance>;
}

export const CharacterDefaults: Partial<Character> = {
    age: 0,
    pos: new Vector3(-725.74, -282.29, 36.98),
    cash: 0,
    bank: 0,
    appearance: {}
};
