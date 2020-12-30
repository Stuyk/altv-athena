import { Character, CharacterDefaults } from '../../../shared/interfaces/Character';

export function initDataPrototype(data: Character) {
    Object.keys(data).forEach((key) => {
        this.data[key] = data[key];
    });
}

export function updateDataByKeysPrototype(dataObject: {}, targetDataName: string = '') {
    Object.keys(dataObject).forEach((key) => {
        if (targetDataName !== '') {
            this.data[targetDataName][key] = dataObject[key];
        } else {
            this.data[key] = dataObject[key];
        }
    });
}

export function initPrototype() {
    this.data = Object.assign({}, CharacterDefaults);
}
