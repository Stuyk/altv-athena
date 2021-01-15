import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';

export interface DataUpdaterPrototype {
    /**
     * Used to give default values to this player on connect.
     * @param {(Character | null)} data
     * @memberof DataUpdaterPrototype
     */
    init(data: Character | null);

    /**
     * Update this player's data property with bulk data.
     * @param {{ [key: string]: any }} dataObject
     * @param {string} targetDataName
     * @memberof DataUpdaterPrototype
     */
    updateByKeys(dataObject: { [key: string]: any }, targetDataName: string);
}

export function bind(): DataUpdaterPrototype {
    const _this = this;
    _this.init = init;
    _this.updateByKeys = updateByKeys;
    return _this;
}

/**
 * Used to initialize player.data with all data from a Character object.
 * Overwrites all existing data on the player for their session.
 * @param {Character} data
 * @memberof DataUpdaterPrototype
 */
function init(data: Character = null) {
    const p: alt.Player = (this as unknown) as alt.Player;

    p.data = Object.assign({}, CharacterDefaults);

    if (data) {
        Object.keys(data).forEach((key) => {
            p.data[key] = data[key];
        });
    }
}

/**
 * Used to set multiple keys in the player.data section of this player.
 * @param {{ [key: string]: any }} dataObject An object full of properties and values.
 * @param {string} [targetDataName=''] A property inside of player.data* OPTIONAL
 * @memberof DataUpdaterPrototype
 */
function updateByKeys(dataObject: { [key: string]: any }, targetDataName: string = '') {
    const p: alt.Player = (this as unknown) as alt.Player;

    Object.keys(dataObject).forEach((key) => {
        if (targetDataName !== '') {
            p.data[targetDataName][key] = dataObject[key];
        } else {
            p.data[key] = dataObject[key];
        }
    });
}
