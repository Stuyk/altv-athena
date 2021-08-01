import { Vector3 } from '../interfaces/Vector';
import { DEFAULT_CONFIG } from '../../server/athena/main';
import { Appearance } from './Appearance';
import { CharacterInfo } from './CharacterInfo';
import { Item } from './Item';
import { CHARACTER_PERMISSIONS } from '../flags/PermissionFlags';

export interface Character {
    /**
     * The character identifier in the database.
     * @type {*}
     * @memberof Character
     */
    _id?: any;

    /**
     * The account id associated with this character.
     * @type {*}
     * @memberof Character
     */
    account_id: any;

    /**
     * The position that this character last logged out at.
     * This also updates every 5s or so.
     * @type {Partial<Vector3>}
     * @memberof Character
     */
    pos: Partial<Vector3>;

    /**
     * The name of this character to display to other users.
     * @type {string}
     * @memberof Character
     */
    name: string;

    /**
     * The amount of cash this character has.
     * @type {number}
     * @memberof Character
     */
    cash: number;

    /**
     * The amount of cash in the bank this character has.
     * @type {number}
     * @memberof Character
     */
    bank: number;

    /**
     * The amount of health the player last had.
     * @type {number} 99 - 200
     * @memberof Character
     */
    health: number;

    /**
     * The amount of armour the player last had.
     * @type {number} 0 - 100
     * @memberof Character
     */
    armour: number;

    /**
     * The amount of food the player has.
     * @type {number} 0 - 100
     * @memberof Character
     */
    food: number;

    /**
     * The amount of water the player has.
     * @type {number}
     * @memberof Character
     */
    water: number;

    /**
     * Is this player dead or not.
     * Health does not dictate whether a player is alive or dead.
     * @type {boolean}
     * @memberof Character
     */
    isDead: boolean;

    /**
     * Amount of hours the player has played.
     * @type {number}
     * @memberof Character
     */
    hours: number;

    /**
     * The last interior this player was in.
     * This is simply an id.
     * @type {(string | null)}
     * @memberof Character
     */
    interior: string | null;

    /**
     * Wanted stars to display.
     * @type {number} 0 - 5
     * @memberof Character
     */
    wanted: number;

    /**
     * Unique character specific permissions for commands.
     * @type {(CharacterPermissions | null)}
     * @memberof Character
     */
    characterPermission?: CHARACTER_PERMISSIONS | null;

    /**
     * Appearance data for how this character looks.
     * @type {Partial<Appearance>}
     * @memberof Character
     */
    appearance: Partial<Appearance>;

    /**
     * Character info. Will eventually be used for ID cards.
     * @type {Partial<CharacterInfo>}
     * @memberof Character
     */
    info: Partial<CharacterInfo>;

    /**
     * An array of array(s) that hold player items.
     * Each array in this array are tabs.
     * @type {Array<Array<Partial<Item>>>}
     * @memberof Character
     */
    inventory: Array<Array<Partial<Item>>>;

    /**
     * Clothing the player has equipped.
     * @type {Array<Partial<Item>>}
     * @memberof Character
     */
    equipment: Array<Partial<Item>>;

    /**
     * Items in the player's hotbar. Toolbar.
     * @type {Array<Partial<Item>>}
     * @memberof Character
     */
    toolbar: Array<Partial<Item>>;
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
    wanted: 0
};
