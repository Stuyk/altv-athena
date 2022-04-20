import alt from 'alt-server';
import { Athena } from "../../../../server/api/athena";
import items from './items';

export class UpdateItems {
    static async init() {
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            let itemFactoryItem = await Athena.systems.itemFactory.get(item.dbName);
            
            if(!item.version || !item || !itemFactoryItem || !itemFactoryItem.version) continue;
            if(itemFactoryItem.version != item.version) {
                alt.log(`${itemFactoryItem.name} is outdated - Version: ${itemFactoryItem.version}. Trying to update.`);
                try {
                    itemFactoryItem = item;
                    await Athena.systems.itemFactory.update(itemFactoryItem.dbName, itemFactoryItem);
                    alt.log(`${itemFactoryItem.name} was updated. Version: ${itemFactoryItem.version}.`);
                } catch(e) {
                    alt.logError(`Seems like something went wrong in the item updating process. ${e}`);
                }
            }
        }
    }
}