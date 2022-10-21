import { ItemFactory } from '@AthenaServer/systems/item';
import { ITEM_TYPE } from '@AthenaShared/enums/itemTypes';
import { getWeaponList } from '@AthenaShared/information/weaponList';
import items from './items';

export class RegisterItems {
    static async init() {
        for (let i = 0; i < items.length; i++) {
            ItemFactory.add(items[i]);
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
                version: 1,
            });
        }
    }
}
