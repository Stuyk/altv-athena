import { Vector3 } from 'alt-server';

export interface ICharacter {
    _id?: string;
    account_id?: string;
    name: string;
    age: number;
    pos: Vector3;
    cash: number;
    bank: number;
}

export const ICharacterDefaults: ICharacter = {
    name: '',
    age: -1,
    pos: new Vector3(0, 0, 0),
    cash: 0,
    bank: 0
};
