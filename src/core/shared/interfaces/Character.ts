import { Vector3 } from 'alt-server';
import { DEFAULT_CONFIG } from '../../server/athena/main';
import { Appearance } from './Appearance';
import { CharacterInfo } from './CharacterInfo';
import { Item } from './Item';

export interface Character {
    _id?: string;
    account_id: string;
    pos: Vector3;
    name: string;
    cash: number;
    bank: number;
    health: number;
    armour: number;
    isDead: boolean;
    appearance: Partial<Appearance>;
    info: Partial<CharacterInfo>;
    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
}

export const CharacterDefaults: Partial<Character> = {
    pos: DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS as Vector3,
    cash: DEFAULT_CONFIG.PLAYER_CASH,
    bank: DEFAULT_CONFIG.PLAYER_BANK,
    appearance: {},
    info: {}
};
