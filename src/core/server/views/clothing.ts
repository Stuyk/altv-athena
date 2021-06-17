import * as alt from 'alt-server';
import { View_Events_Clothing } from '../../shared/enums/views';
import { playerFuncs } from '../extensions/Player';
import { ClothingComponent } from '../../shared/interfaces/Clothing';
import { Item } from '../../shared/interfaces/Item';
import { ItemType } from '../../shared/enums/itemType';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

alt.onClient(View_Events_Clothing.Exit, handleExit);
alt.onClient(View_Events_Clothing.Purchase, handlePurchase);

// Do not change order
const icons = ['hat', 'mask', 'shirt', 'bottoms', 'shoes', 'glasses', 'ear', 'backpack', 'armour', 'watch', 'bracelet'];

const wearableRef: Item = {
    name: `Item`,
    description: `An Item`,
    icon: 'crate',
    slot: 0,
    quantity: 1,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_EQUIPMENT,
    data: {}
};

function handleExit(player: alt.Player) {
    playerFuncs.sync.inventory(player);
}

function handlePurchase(
    player: alt.Player,
    equipmentSlot: number,
    component: ClothingComponent,
    name: string,
    desc: string
) {
    const newItem = deepCloneObject<Item>(wearableRef);
    newItem.name = name;
    newItem.description = desc;
    newItem.data = { ...component };
    newItem.data.sex = player.data.appearance.sex;
    newItem.slot = equipmentSlot;
    newItem.icon = icons[equipmentSlot];
    newItem.quantity = 1;
    newItem.equipment = equipmentSlot;

    let didGetAdded = false;

    if (playerFuncs.inventory.isEquipmentSlotFree(player, equipmentSlot)) {
        didGetAdded = playerFuncs.inventory.equipmentAdd(player, newItem, equipmentSlot);
    } else {
        const openSlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (!openSlot) {
            playerFuncs.emit.sound2D(player, 'item_error');
            return;
        }

        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CLOTHING_ITEM_IN_INVENTORY));
        didGetAdded = playerFuncs.inventory.inventoryAdd(player, newItem, openSlot.slot, openSlot.tab);
    }

    if (!didGetAdded) {
        playerFuncs.emit.sound2D(player, 'item_error');
        return;
    }

    playerFuncs.save.field(player, 'inventory', player.data.inventory);
    playerFuncs.save.field(player, 'equipment', player.data.equipment);
    playerFuncs.sync.inventory(player);
    playerFuncs.emit.sound2D(player, 'item_purchase');
}
