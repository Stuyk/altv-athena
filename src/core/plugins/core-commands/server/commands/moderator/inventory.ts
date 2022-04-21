import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';

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
}
