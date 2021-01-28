import * as alt from 'alt-server';
import { View_Events_Clothing } from '../../shared/enums/views';
import * as sm from 'simplymongo';
import { playerFuncs } from '../extensions/Player';
import { ClothingComponent } from '../../shared/interfaces/Clothing';
import { Item } from '../../shared/interfaces/Item';
import { ItemType } from '../../shared/enums/itemType';
import { deepCloneObject } from '../../shared/utility/deepCopy';

const db: sm.Database = sm.getDatabase();

alt.onClient(View_Events_Clothing.Exit, handleExit);
alt.onClient(View_Events_Clothing.Purchase, handlePurchase);

// Do not change order
const icons = ['hat', 'mask', 'shirt', 'bottoms', 'shoes', 'glasses', 'ear', 'backpack', 'armour'];

const wearableRef: Item = {
    name: `Item`,
    description: `An Item`,
    icon: 'crate',
    slot: 0,
    quantity: 1,
    weight: 1,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_EQUIPMENT,
    data: {}
};

function handleExit(player: alt.Player) {
    playerFuncs.sync.inventory(player);
}

function handlePurchase(player: alt.Player, equipmentSlot: number, component: ClothingComponent) {
    const newItem = deepCloneObject<Item>(wearableRef);
    newItem.data = { ...component };
    newItem.data.sex = player.data.appearance.sex;
    newItem.slot = equipmentSlot;
    newItem.icon = icons[equipmentSlot];
    newItem.quantity = 1;
    newItem.weight = Math.floor(Math.random() * 10) + 1;
    newItem.equipment = equipmentSlot;

    let didGetAdded = false;

    if (playerFuncs.inventory.isEquipmentSlotFree(player, equipmentSlot)) {
        didGetAdded = playerFuncs.inventory.equipmentAdd(player, newItem, equipmentSlot);
    } else {
        const openSlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (!openSlot) {
            // Error Sound
            return;
        }

        didGetAdded = playerFuncs.inventory.inventoryAdd(player, newItem, openSlot.slot, openSlot.tab);
    }

    if (!didGetAdded) {
        // Error Sound
        return;
    }

    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.save.field(player, 'equipment', player.data.equipment);
    playerFuncs.sync.inventory(player);
    // Cha-Ching
}
