import alt from 'alt-server';
import { Athena } from "../../../../server/api/athena";
import { drinks } from './items/drinks';
import { food } from './items/food';
import { utility } from './items/utility';

export class UpdateItems {
    static async init() {
        const itemsToUpdate = [
            ...drinks,
            ...food,
            ...utility
        ];

        for(let i = 0; i < itemsToUpdate.length; i++) {
            const item = itemsToUpdate[i];
            let itemFactoryItem = await Athena.systems.itemFactory.get(item.dbName);
            if(itemFactoryItem.version != item.version) {
                alt.log(`${itemFactoryItem.name} is outdated - Version: ${itemFactoryItem.version}. Trying to update.`);
                try {
                    itemFactoryItem = item;
                    await Athena.systems.itemFactory.update(itemFactoryItem.dbName, itemFactoryItem);
                    alt.log(`${itemFactoryItem.name} was updated. Version: ${itemFactoryItem.version}.`);
                } catch(e) {
                    alt.logError(`Seems like something went wrong in the item updating process. ${e}`);
                }
            } else continue;
        }
    }
}