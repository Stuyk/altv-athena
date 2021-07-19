import { Vector3 } from '../interfaces/Vector';
import { DEFAULT_CONFIG } from '../../server/athena/main';
import { Appearance } from './Appearance';
import { CharacterInfo } from './CharacterInfo';
import { Item } from './Item';
import { Vehicle } from './Vehicle';
import { CharacterPermissions } from '../flags/permissions';

export interface Character {
    _id?: any;
    account_id: any;
    pos: Partial<Vector3>;
    name: string;
    cash: number;
    bank: number;
    health: number;
    armour: number;
    food: number;
    water: number;
    isDead: boolean;
    hours: number;
    interior: string | null;
    wanted: number;
    characterPermission?: CharacterPermissions | null;
    exterior: Partial<Vector3>;
    appearance: Partial<Appearance>;
    info: Partial<CharacterInfo>;
    inventory: Array<Array<Partial<Item>>>;
    equipment: Array<Partial<Item>>;
    toolbar: Array<Partial<Item>>;
    vehicles: Array<Partial<Vehicle>>;
}

export const CharacterDefaults: Partial<Character> = {
    pos: DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS as Vector3,
    cash: DEFAULT_CONFIG.PLAYER_CASH,
    bank: DEFAULT_CONFIG.PLAYER_BANK,
    appearance: {},
    info: {},
    food: 100,
    water: 100,
    isDead: false,
    health: 199,
    armour: 0,
    hours: 0,
    wanted: 0,
    vehicles: []
};
