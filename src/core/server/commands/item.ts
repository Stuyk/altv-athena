import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Item } from '../../shared/interfaces/Item';
import { Permissions } from '../../shared/flags/permissions';
import { ItemType } from '../../shared/enums/itemType';
import { playerFuncs } from '../extensions/Player';
import { EquipmentType } from '../../shared/enums/equipment';

const gunItem: Item = {
    name: `Gun`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'gun',
    slot: 0,
    quantity: 1,
    weight: 2,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.IS_WEAPON,
    data: {
        bang: true
    }
};

const equipmentItem: Item = {
    name: `Backpack`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Can go into the bag section. Cannot go into toolbar.`,
    icon: 'backpack',
    slot: 1,
    quantity: 1,
    weight: 2,
    equipment: EquipmentType.BAG,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_EQUIPMENT,
    data: {
        drawable: 0
    }
};

const boxItem: Item = {
    name: `Crate`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Inventory only.`,
    icon: 'crate',
    slot: 2,
    quantity: 1,
    weight: 5,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE,
    data: {
        drawable: 0
    }
};

ChatController.addCommand('dummyitem', '/dummyitem - Get some dummy debug items', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player): void {
    let itemClone = { ...gunItem };
    player.data.inventory[0].push(itemClone);

    itemClone = { ...equipmentItem };
    player.data.inventory[0].push(itemClone);

    itemClone = { ...boxItem };
    player.data.inventory[0].push(itemClone);
    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.sync.inventory(player);
}
