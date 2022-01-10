import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Item } from '../../shared/interfaces/item';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { playerFuncs } from '../extensions/extPlayer';
import { EQUIPMENT_TYPE } from '../../shared/enums/equipmentType';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { ItemFactory } from '../systems/item';

ChatController.addCommand(
    'getitem',
    LocaleController.get(LOCALE_KEYS.COMMAND_GET_ITEM, '/getitem'),
    PERMISSIONS.ADMIN,
    handleGetItem,
);

async function handleGetItem(player: alt.Player, ...args) {
    const fullItemName = args.join(' ');
    if (fullItemName.length <= 2) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
        return;
    }

    const item = await ItemFactory.getByName(fullItemName);
    if (!item) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
        return;
    }

    item.quantity = 1;

    const itemClone = deepCloneObject<Item>(item);
    let slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot);
    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.sync.inventory(player);
    playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_WAS_ADDED_INVENTORY, item.name));
}
