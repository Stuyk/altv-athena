import { Vector3 } from './vector';
import { Character } from './character';
import { SHARED_CONFIG } from '../configurations/shared';

export const CharacterDefaults: Partial<Character> = {
    pos: SHARED_CONFIG.PLAYER_NEW_SPAWN_POS as Vector3,
    cash: SHARED_CONFIG.PLAYER_CASH,
    bank: SHARED_CONFIG.PLAYER_BANK,
    appearance: {},
    info: {},
    food: 100,
    water: 100,
    isDead: false,
    health: 199,
    armour: 0,
    hours: 0,
    wanted: 0,
};
