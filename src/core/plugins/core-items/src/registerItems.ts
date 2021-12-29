import { ItemFactory } from '../../../server/systems/item';
import { items } from './items';

export class RegisterItems {
    static async init() {
        const itemsToAdd = [...items];
        for (let i = 0; i < itemsToAdd.length; i++) {
            ItemFactory.add(itemsToAdd[i]);
        }
    }
}
