import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { ItemFactory } from '../../../../../server/systems/item';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { Item } from '../../../../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { deepCloneObject } from '../../../../../shared/utility/deepCopy';

class GetItemCommand {
    @command('getitem', LocaleController.get(LOCALE_KEYS.COMMAND_GET_ITEM, '/getitem'), PERMISSIONS.ADMIN) 
    private static async handleGetItem(player: alt.Player, ...args) {
        const fullItemName = args.join(' ');
        if (fullItemName.length <= 1) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
            return;
        }
    
        const item = await ItemFactory.getByName(fullItemName);
        if (!item) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
            return;
        }
    
        item.quantity = 1;
    
        const itemClone = deepCloneObject<Item>(item);
        let slotInfo = Athena.player.inventory.getFreeInventorySlot(player);
        Athena.player.inventory.inventoryAdd(player, itemClone, slotInfo.slot);
        Athena.player.save.field(player, 'inventory', player.data.inventory);
        Athena.player.sync.inventory(player);
        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_WAS_ADDED_INVENTORY, item.name));
    }
}
