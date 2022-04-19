import { ItemFactory } from '../../../../server/systems/item';
import { ITEM_TYPE } from '../../../../shared/enums/itemTypes';
import { getWeaponList } from '../../../../shared/information/weaponList';
import { drinks } from './items/drinks';
import { food } from './items/food';
import { utility } from './items/utility';
export class RegisterItems {
    static async init() {
        const itemsToAdd = [
            ...drinks, 
            ...food, 
            ...utility
        ];

        for (let i = 0; i < itemsToAdd.length; i++) {
            ItemFactory.add(itemsToAdd[i]);
        }

        const weaponList = getWeaponList();
        for (let i = 0; i < weaponList.length; i++) {
            const weapon = weaponList[i];
            ItemFactory.add({
                name: weapon.name,
                description: weapon.desc,
                icon: weapon.icon,
                slot: 0,
                quantity: 1,
                behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.IS_WEAPON,
                data: {
                    hash: weapon.hash,
                },
                dbName: weapon.name,
                version: 1
            });
        }
    }
}
