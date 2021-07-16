import * as alt from 'alt-server';
import { View_Events_Clothing } from '../../shared/enums/views';
import { playerFuncs } from '../extensions/Player';
import { ClothingComponent } from '../../shared/interfaces/Clothing';
import { Item } from '../../shared/interfaces/Item';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { deepCloneObject } from '../../shared/utility/deepCopy';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import clothingStores from '../../shared/information/clothingStores';
import { BlipController } from '../systems/blip';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { InteractionController } from '../systems/interaction';

// Do not change order
const icons = ['hat', 'mask', 'shirt', 'bottoms', 'shoes', 'glasses', 'ear', 'backpack', 'armour', 'watch', 'bracelet'];
const wearableRef: Item = {
    name: `Item`,
    description: `An Item`,
    icon: 'crate',
    slot: 0,
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_EQUIPMENT,
    data: {}
};

class ClothingFunctions {
    static init() {
        for (let i = 0; i < clothingStores.length; i++) {
            const position = clothingStores[i];
            const uid = `clothing-store-${i}`;

            BlipController.add({
                text: 'Clothing Store',
                color: 11,
                sprite: 73,
                scale: 1,
                shortRange: true,
                pos: position,
                uid
            });

            InteractionController.add({
                position,
                description: 'Browse Clothing Store',
                type: 'clothing-store',
                callback: (player: alt.Player) => {
                    alt.emitClient(player, View_Events_Clothing.Open);
                }
            });
        }
    }

    static exit(player: alt.Player) {
        playerFuncs.sync.inventory(player);
    }

    static purchase(
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
}

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, ClothingFunctions.init);
alt.onClient(View_Events_Clothing.Exit, ClothingFunctions.exit);
alt.onClient(View_Events_Clothing.Purchase, ClothingFunctions.purchase);
