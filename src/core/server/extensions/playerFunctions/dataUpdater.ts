import * as alt from 'alt-server';
import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';

/**
 * Used to initialize player.data with all data from a Character object.
 * Overwrites all existing data on the player for their session.
 * @param {Character} data
 * @memberof DataUpdaterPrototype
 */
function init(p: alt.Player, data: Character = null) {
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
function updateByKeys(p: alt.Player, dataObject: { [key: string]: any }, targetDataName: string = '') {
    Object.keys(dataObject).forEach((key) => {
        if (targetDataName !== '') {
            p.data[targetDataName][key] = dataObject[key];
        } else {
            p.data[key] = dataObject[key];
        }
    });
}

export default {
    init,
    updateByKeys
};
