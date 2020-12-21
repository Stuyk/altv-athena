import { Vector3 } from 'alt-server';
import { Appearance } from './Appearance';
import { CharacterInfo } from './CharacterInfo';

export interface Character {
    _id?: string;
    account_id: string;
    pos: Vector3;
    cash: number;
    bank: number;
    appearance: Partial<Appearance>;
    info: Partial<CharacterInfo>;
}

export const CharacterDefaults: Partial<Character> = {
    pos: new Vector3(-725.74, -282.29, 36.98),
    cash: 0,
    bank: 0,
    appearance: {},
    info: {}
};
