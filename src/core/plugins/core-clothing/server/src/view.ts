import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { PolygonShape } from '../../../../server/extensions/extColshape';
import { ServerBlipController } from '../../../../server/systems/blip';
import { InteractionController } from '../../../../server/systems/interaction';
import { sha256 } from '../../../../server/utility/encryption';
import { CurrencyTypes } from '../../../../shared/enums/currency';
import { ITEM_TYPE } from '../../../../shared/enums/itemTypes';
import { Blip } from '../../../../shared/interfaces/blip';
import { ClothingComponent } from '../../../../shared/interfaces/clothing';
import { Interaction } from '../../../../shared/interfaces/interaction';
import { Item } from '../../../../shared/interfaces/item';
import { Vector3 } from '../../../../shared/interfaces/vector';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { deepCloneObject } from '../../../../shared/utility/deepCopy';
import { CLOTHING_STORE_PAGE } from '../../shared/enums';
import { CLOTHING_INTERACTIONS } from '../../shared/events';
import { IClothingStore } from '../../shared/interfaces';
import clothingStores from './stores';

// Do not change order
const icons = [
    'hat',
    'mask',
    'shirt',
    'bottoms',
    'shoes',
    'glasses',
    'ear',
    'backpack',
    'armour',
    'watch',
    'bracelet',
    'accessory',
];

const wearableRef: Item = {
    name: `Item`,
    description: `An Item`,
    icon: 'crate',
    slot: 0,
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_EQUIPMENT,
    data: {},
};

const DefaultClothingData: IClothingStore = {
    hiddenComponents: {},
    hiddenPages: [],
    pagePrices: {
        [CLOTHING_STORE_PAGE.ARMOUR]: 1000,
        [CLOTHING_STORE_PAGE.BAG]: 125,
        [CLOTHING_STORE_PAGE.BOTTOMS]: 25,
        [CLOTHING_STORE_PAGE.BRACELET]: 5,
        [CLOTHING_STORE_PAGE.EARRINGS]: 5,
        [CLOTHING_STORE_PAGE.GLASSES]: 50,
        [CLOTHING_STORE_PAGE.HATS]: 75,
        [CLOTHING_STORE_PAGE.MASK]: 250,
        [CLOTHING_STORE_PAGE.SHIRT]: 25,
        [CLOTHING_STORE_PAGE.SHOES]: 25,
        [CLOTHING_STORE_PAGE.WATCH]: 200,
        [CLOTHING_STORE_PAGE.ACCESSORY]: 50,
    },
    clothingPrices: {},
};

let clothingStoreList: Array<IClothingStore> = [];
let isClothingStoresReady = false;

export class ClothingFunctions {
    /**
     * Initializes all clothing stores on server-start.
     * @static
     * @memberof ClothingFunctions
     */
    static init() {
        for (let i = 0; i < clothingStores.length; i++) {
            const position = clothingStores[i];
            const uid = `clothing-store-${i}`;

            // Do not change.
            const defaultBlip: Blip = {
                text: 'Clothing Store',
                color: 11,
                sprite: 73,
                scale: 1,
                shortRange: true,
                pos: position,
                uid,
            };

            // Do not change.
            const defaultInteraction: Interaction = {
                position,
                description: 'Browse Clothing Store',
            };

            if (clothingStores[i].vertices) {
                const polygon = new PolygonShape(position.z, position.z + 2.5, clothingStores[i].vertices, true, false);

                polygon.addEnterCallback(ClothingFunctions.enter);
                polygon.addLeaveCallback(ClothingFunctions.leave);
                polygon.isPlayerOnly = true;
            }

            const clothingData = deepCloneObject<IClothingStore>(DefaultClothingData);
            clothingData.uid = uid;

            ClothingFunctions.create(
                position,
                clothingData,
                deepCloneObject(defaultBlip),
                deepCloneObject(defaultInteraction),
            );
        }

        isClothingStoresReady = true;
    }

    /**
     * Used to create dynamic clothing stores.
     * @static
     * @param {IClothingStore} store
     * @memberof ClothingFunctions
     */
    static create(position: Vector3, store: IClothingStore, blip: Blip, interaction: Interaction) {
        if (!store.uid) {
            store.uid = sha256(JSON.stringify(store));
        }

        blip.uid = store.uid;
        blip.pos = position;
        interaction.position = {
            x: position.x,
            y: position.y,
            z: position.z - 1,
        };
        interaction.isPlayerOnly = true;
        interaction.callback = (player: alt.Player) => {
            const data = ClothingFunctions.getClothingStoreData(store.uid);
            alt.emitClient(player, CLOTHING_INTERACTIONS.OPEN, data);
        };

        ServerBlipController.append(blip);
        InteractionController.add(interaction);
        clothingStoreList.push(store);
    }

    /**
     * Used to get the clothing store data and pass it down to the player.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof ClothingFunctions
     */
    static getClothingStoreData(uid: string): IClothingStore {
        const index = clothingStoreList.findIndex((x) => x.uid === uid);
        if (index <= -1) {
            return null;
        }

        return clothingStoreList[index];
    }

    /**
     * Used to override default clothing store data.
     * @static
     * @param {string} uid
     * @param {IClothingStore} data
     * @return {*}
     * @memberof ClothingFunctions
     */
    static async overrideClothingData(uid: string, data: IClothingStore) {
        await this.waitForReady();
        const index = clothingStoreList.findIndex((x) => x.uid === uid);
        if (index <= -1) {
            console.error(new Error(`Clothing store with ${uid} does not exist.`));
            return;
        }

        data.uid = clothingStoreList[index].uid;
        clothingStoreList[index] = data;
    }

    /**
     * Used to wait for the clothing store to be ready before
     * overriding any data.
     * @private
     * @static
     * @return {*}  {Promise<void>}
     * @memberof ClothingFunctions
     */
    private static waitForReady(): Promise<void> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!isClothingStoresReady) {
                    return;
                }

                alt.clearInterval(interval);
                return resolve();
            }, 100);
        });
    }

    /**
     * Forces re-synchronization so that the player's equipment and clothing
     * are set to what they currently have equipped after leaving.
     * @static
     * @param {alt.Player} player
     * @memberof ClothingFunctions
     */
    static exit(player: alt.Player) {
        Athena.player.sync.inventory(player);
    }

    /**
     * How clothing purchases are handled.
     * @static
     * @param {alt.Player} player
     * @param {number} equipmentSlot
     * @param {ClothingComponent} component
     * @param {string} name
     * @param {string} desc
     * @return {*}
     * @memberof ClothingFunctions
     */
    static purchase(
        player: alt.Player,
        shopUID: string,
        equipmentSlot: number,
        component: ClothingComponent,
        name: string,
        desc: string,
    ) {
        const index = clothingStoreList.findIndex((x) => x.uid === shopUID);
        if (index <= -1) {
            Athena.player.emit.sound2D(player, 'item_error');
            return;
        }

        const shop = clothingStoreList[index];
        const id: number = component.internalID;

        let totalCost: number = 0;
        for (let i = 0; i < component.drawables.length; i++) {
            const drawable: number = component.drawables[i];

            // Price based on component id in individual shop.
            if (shop.clothingPrices[id]) {
                const componentInfo = shop.clothingPrices[id].find((item) => {
                    if (item.id === drawable) {
                        return true;
                    }

                    return false;
                });

                if (componentInfo && componentInfo.price) {
                    totalCost += componentInfo.price;
                    continue;
                }
            }

            // Get individual page cost for all items if component has no price.
            if (shop.pagePrices[id]) {
                totalCost += shop.pagePrices[id];
            }
        }

        if (totalCost >= 1) {
            if (player.data.cash < totalCost) {
                Athena.player.emit.sound2D(player, 'item_error');
                return;
            }
        }

        // Remove unncessary information
        delete component.internalID;

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

        if (Athena.player.inventory.isEquipmentSlotFree(player, equipmentSlot)) {
            didGetAdded = Athena.player.inventory.equipmentAdd(player, newItem, equipmentSlot);
        } else {
            const openSlot = Athena.player.inventory.getFreeInventorySlot(player);
            if (!openSlot) {
                Athena.player.emit.sound2D(player, 'item_error');
                return;
            }

            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CLOTHING_ITEM_IN_INVENTORY));
            didGetAdded = Athena.player.inventory.inventoryAdd(player, newItem, openSlot.slot);
        }

        if (!didGetAdded) {
            Athena.player.emit.sound2D(player, 'item_error');
            return;
        }

        if (totalCost >= 1) {
            if (!Athena.player.currency.sub(player, CurrencyTypes.CASH, totalCost)) {
                Athena.player.emit.sound2D(player, 'item_error');
                return;
            }
        }

        Athena.player.save.field(player, 'inventory', player.data.inventory);
        Athena.player.save.field(player, 'equipment', player.data.equipment);
        Athena.player.sync.inventory(player);
        Athena.player.emit.sound2D(player, 'item_purchase');
    }

    /**
     * When a player enters a stream polygon, play a sound.
     * @param {uniontype} player - The player that entered the polygon.
     * @param {IStreamPolygon} polygon - The polygon that the player is entering.
     */
    static enter(polygon: PolygonShape, player: alt.Player) {
        if (!(player instanceof alt.Player)) {
            return;
        }

        Athena.player.emit.sound2D(player, 'shop_enter', 0.5);
    }

    /**
     * When a player leaves a polygon, the function is called.
     * @param {T} player - The player that is leaving the polygon.
     * @param {IStreamPolygon} polygon - The polygon that the player is leaving.
     */
    static leave(polygon: PolygonShape, player: alt.Player) {
        // Not Important. Just a placeholder
    }
}

alt.onClient(CLOTHING_INTERACTIONS.EXIT, ClothingFunctions.exit);
alt.onClient(CLOTHING_INTERACTIONS.PURCHASE, ClothingFunctions.purchase);
