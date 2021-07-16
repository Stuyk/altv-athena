import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { Item } from '../../shared/interfaces/Item';
import { Permissions } from '../../shared/flags/permissions';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { playerFuncs } from '../extensions/Player';
import { EQUIPMENT_TYPE } from '../../shared/enums/equipmentTypes';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { getFromRegistry, ItemRegistry } from '../../shared/items/itemRegistry';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

const pistolItem: Item = {
    name: `Pistol`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'pistol',
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.IS_WEAPON,
    data: {
        hash: 0x1b06d571
    }
};

const equipmentItem: Item = {
    name: `Backpack`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Can go into the bag section. Cannot go into toolbar.`,
    icon: 'backpack',
    quantity: 1,
    equipment: EQUIPMENT_TYPE.BAG,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_EQUIPMENT,
    data: {
        drawable: 0
    }
};

const boxItem: Item = {
    name: `Crate`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Inventory only.`,
    icon: 'crate',
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE,
    data: {
        drawable: 0
    }
};

const smgItem: Item = {
    name: `Micro SMG`,
    uuid: `some_hash_thing_ground`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'smg',
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.IS_WEAPON,
    data: {
        hash: 0x13532244
    }
};

const burgerItem: Item = {
    name: `Burger`,
    uuid: `food_1`,
    description: `Debug: Should be able to call an event with this`,
    icon: 'burger',
    quantity: 5,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CONSUMABLE,
    data: {
        event: 'effect:Heal',
        heal: 25,
        sound: 'item_eat'
    }
};

ChatController.addCommand(
    'dummyitem',
    LocaleController.get(LOCALE_KEYS.COMMAND_DUMMY_ITEM, '/dummyitem'),
    Permissions.Admin,
    handleCommand
);

ChatController.addCommand(
    'getitem',
    LocaleController.get(LOCALE_KEYS.COMMAND_GET_ITEM, '/getitem'),
    Permissions.Admin,
    handleGetItem
);

// alias
ChatController.addCommand(
    'spawnitem',
    LocaleController.get(LOCALE_KEYS.COMMAND_GET_ITEM, '/spawnitem'),
    Permissions.Admin,
    handleGetItem
);

function handleCommand(player: alt.Player): void {
    let itemClone = deepCloneObject<Item>(pistolItem);
    let slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot, slotInfo.tab);
    itemClone = deepCloneObject<Item>(equipmentItem);
    slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot, slotInfo.tab);
    itemClone = deepCloneObject<Item>(boxItem);
    slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot, slotInfo.tab);
    itemClone = deepCloneObject<Item>(smgItem);
    slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot, slotInfo.tab);
    itemClone = deepCloneObject<Item>(burgerItem);
    slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot, slotInfo.tab);
    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.sync.inventory(player);
}

function handleGetItem(player: alt.Player, name: string) {
    const item = getFromRegistry(name);

    if (!item) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_DOES_NOT_EXIST, name));
        return;
    }

    const itemClone = deepCloneObject<Item>(item);
    let slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
    playerFuncs.inventory.inventoryAdd(player, itemClone, slotInfo.slot, slotInfo.tab);
    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.sync.inventory(player);
    playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.ITEM_WAS_ADDED_INVENTORY, item.name));
}
