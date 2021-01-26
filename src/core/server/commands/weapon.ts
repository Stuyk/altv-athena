import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Item } from '../../shared/interfaces/Item';
import { Permissions } from '../../shared/flags/permissions';
import { ItemType } from '../../shared/enums/itemType';
import { playerFuncs } from '../extensions/Player';
import { EquipmentType } from '../../shared/enums/equipment';
import { getWeaponByName } from '../../shared/information/weaponList';
import { sha256Random } from '../utility/encryption';

ChatController.addCommand('dummyitem', '/dummyitem - Get some dummy debug items', Permissions.Admin, handleCommand);

const itemRef: Item = {
    name: `Micro SMG`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'gun',
    slot: 4,
    quantity: 1,
    weight: 2,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.IS_WEAPON,
    data: {
        hash: 0x13532244
    }
};

function handleCommand(player: alt.Player, weaponName: string): void {
    const { tab, slot } = playerFuncs.inventory.getFreeInventorySlot(player, 0);

    if (tab === null || slot === null) {
        playerFuncs.emit.message(player, `No room in first inventory tab.`);
        return;
    }

    const itemHash = getWeaponByName(weaponName);
    if (!itemHash) {
        playerFuncs.emit.message(player, `Weapon does not exist.`);
        return;
    }

    const newItem = Object.assign({}, itemRef);
    newItem.name = weaponName.toUpperCase();
    newItem.data.hash = itemHash;
    newItem.uuid = sha256Random(JSON.stringify(newItem));
    newItem.icon = 'gun';

    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.sync.inventory(player);
}
