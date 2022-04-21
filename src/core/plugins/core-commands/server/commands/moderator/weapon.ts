import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { sha256Random } from '../../../../../server/utility/encryption';
import { ITEM_TYPE } from '../../../../../shared/enums/itemTypes';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
import { getWeaponByName } from '../../../../../shared/information/weaponList';
import { Item } from '../../../../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { deepCloneObject } from '../../../../../shared/utility/deepCopy';

const itemRef: Item = {
    name: `Micro SMG`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'gun',
    slot: 4,
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.IS_WEAPON,
    data: {
        hash: 0x13532244,
    },
};
class WeaponCommands {
    @command('weapon', LocaleController.get(LOCALE_KEYS.COMMAND_WEAPON, '/weapon'), PERMISSIONS.ADMIN)
    private static handleCommand(player: alt.Player, weaponName: string): void {
        const inv = Athena.player.inventory.getFreeInventorySlot(player);

        if (inv === null || inv.slot === null) {
            Athena.player.emit.message(player, `No room in first inventory tab.`);
            return;
        }

        const weapon = getWeaponByName(weaponName);
        if (!weapon) {
            Athena.player.emit.message(player, `Weapon does not exist.`);
            return;
        }

        const newItem = deepCloneObject<Item>(itemRef);
        newItem.name = weaponName.toUpperCase();
        newItem.name = weapon.name;
        newItem.description = weapon.desc;
        newItem.uuid = sha256Random(JSON.stringify(newItem));
        newItem.icon = weaponName.toLowerCase();
        newItem.slot = inv.slot;
        newItem.data.hash = weapon.hash;

        if (weapon.stats && Object.keys(weapon.stats).length >= 1) {
            Object.keys(weapon.stats).forEach((key) => {
                newItem.data[key] = weapon.stats[key];
            });
        }

        Athena.player.inventory.inventoryAdd(player, newItem, inv.slot);
        Athena.player.save.field(player, 'inventory', player.data.inventory);
        Athena.player.sync.inventory(player);
        Athena.player.emit.message(player, `Added weapon: ${weapon.name}`);
    }

    @command(
        'removeallweapons',
        LocaleController.get(LOCALE_KEYS.COMMAND_REMOVE_ALL_WEAPONS, '/removeallweapons'),
        PERMISSIONS.ADMIN,
    )
    private static handleRemoveWeapons(player: alt.Player): void {
        const weps = Athena.player.inventory.removeAllWeapons(player);
        Athena.player.emit.message(player, `Removed: ${weps.length} weapons`);
    }
}
