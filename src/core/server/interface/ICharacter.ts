import { Vector3 } from 'alt-server';
import { IAppearance } from '../../shared/interfaces/IAppearance';

export interface ICharacter {
    _id?: string;
    account_id: string;
    age: number;
    pos: Vector3;
    cash: number;
    bank: number;
    appearance: Partial<IAppearance>;
}

export const ICharacterDefaults: Partial<ICharacter> = {
    age: 0,
    pos: new Vector3(-725.74, -282.29, 36.98),
    cash: 0,
    bank: 0,
    appearance: {}
};
