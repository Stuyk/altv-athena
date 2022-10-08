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
        Athena.state.set(player, 'inventory', []);
        Athena.player.sync.inventory(player);
    }

    @command(
        'cleartoolbar',
        LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_TOOLBAR, '/cleartoolbar'),
        PERMISSIONS.ADMIN,
    )
    private static clearToolbeltCommand(player: alt.Player) {
        Athena.state.set(player, 'toolbar', []);
        Athena.player.sync.inventory(player);
    }

    @command(
        'clearequipment',
        LocaleController.get(LOCALE_KEYS.COMMAND_CLEAR_EQUIPMENT, '/clearequipment'),
        PERMISSIONS.ADMIN,
    )
    private static clearEquipmentCommand(player: alt.Player) {
        Athena.state.set(player, 'equipment', []);
        Athena.player.sync.inventory(player);
    }

    @command('getitem', LocaleController.get(LOCALE_KEYS.COMMAND_GET_ITEM, '/getitem'), PERMISSIONS.ADMIN)
    private static async handleGetItem(player: alt.Player, ...args) {
        if (args.length === 0) {
            return Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_ARGUMENTS_MISSING));
        }

        let amount = 1;
        if (args.length >= 2) {
            const newAmount = parseInt(args[args.length - 1]);
            if (!isNaN(newAmount)) {
                amount = newAmount;
                args.pop();
            }
        }

        const fullItemName = args.join(' ')

        if (fullItemName.length <= 1) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
            return;
        }

        let item = await ItemFactory.get(fullItemName);
        if (item === undefined || item === null) {
            item = await ItemFactory.getByName(fullItemName);

            if (item === undefined || item === null) {
                Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, fullItemName));
                return;
            }
        }

        item.quantity = amount;

        const itemClone = deepCloneObject<Item>(item);
        let slotInfo = Athena.player.inventory.getFreeInventorySlot(player);
        Athena.player.inventory.inventoryAdd(player, itemClone, slotInfo.slot);

        Athena.state.set(player, 'inventory', player.data.inventory, true);
        Athena.player.sync.inventory(player);
        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_WAS_ADDED_INVENTORY, item.name));
    }
}
