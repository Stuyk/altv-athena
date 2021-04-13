import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Item } from '../../shared/interfaces/Item';
import { Permissions } from '../../shared/flags/permissions';
import { ItemType } from '../../shared/enums/itemType';
import { playerFuncs } from '../extensions/Player';
import { getWeaponByName } from '../../shared/information/weaponList';
import { sha256Random } from '../utility/encryption';
import { deepCloneObject } from '../../shared/utility/deepCopy';

ChatController.addCommand('weapon', '/weapon [name] - Get weapon by name.', Permissions.Admin, handleCommand);
ChatController.addCommand(
    'removeallweapons',
    '/removeallweapons - Remove all weapons.',
    Permissions.Admin,
    handleRemoveWeapons
);

const itemRef: Item = {
    name: `Micro SMG`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'gun',
    slot: 4,
    quantity: 1,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.IS_WEAPON,
    data: {
        hash: 0x13532244
    }
};

function handleCommand(player: alt.Player, weaponName: string): void {
    const inv = playerFuncs.inventory.getFreeInventorySlot(player);

    if (inv === null || inv.tab === null || inv.slot === null) {
        playerFuncs.emit.message(player, `No room in first inventory tab.`);
        return;
    }

    const weapon = getWeaponByName(weaponName);
    if (!weapon) {
        playerFuncs.emit.message(player, `Weapon does not exist.`);
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

    playerFuncs.inventory.inventoryAdd(player, newItem, inv.slot, inv.tab);
    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.sync.inventory(player);
    playerFuncs.emit.message(player, `Added weapon: ${weapon.name}`);
}

function handleRemoveWeapons(player: alt.Player): void {
    const weps = playerFuncs.inventory.removeAllWeapons(player);
    playerFuncs.emit.message(player, `Removed: ${weps.length} weapons`);
}
