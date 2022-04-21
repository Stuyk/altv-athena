import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { ItemFactory } from '../../../../../server/systems/item';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { Item } from '../../../../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { deepCloneObject } from '../../../../../shared/utility/deepCopy';

class InventoryCommands {
    @command(
        'clearinventory',
        LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_INVENTORY, '/clearinventory'),
        PERMISSIONS.ADMIN,
    )
    private static clearInventoryCommand(player: alt.Player) {
        player.data.inventory = [];
        Athena.player.save.field(player, 'inventory', player.data.inventory);
        Athena.player.sync.inventory(player);
    }

    @command(
        'cleartoolbar',
        LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_TOOLBAR, '/cleartoolbar'),
        PERMISSIONS.ADMIN,
    )
    private static clearToolbeltCommand(player: alt.Player) {
        player.data.toolbar = [];
        Athena.player.save.field(player, 'toolbar', player.data.toolbar);
        Athena.player.sync.inventory(player);
    }

    @command(
        'clearequipment',
        LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_EQUIPMENT, '/clearequipment'),
        PERMISSIONS.ADMIN,
    )
    private static clearEquipmentCommand(player: alt.Player) {
        player.data.equipment = [];
        Athena.player.save.field(player, 'equipment', player.data.equipment);
        Athena.player.sync.inventory(player);
    }

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
