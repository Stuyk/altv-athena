import * as alt from 'alt-server';
import { OSS_TRANSLATIONS } from '..';
import { playerFuncs } from '../../../server/extensions/extPlayer';
import { ItemFactory } from '../../../server/systems/item';
import { CurrencyTypes } from '../../../shared/enums/currency';

const PAGENAME = 'ShopUI';
alt.onClient(
    `${PAGENAME}:Server:HandleShop`,
    async (player: alt.Player, shopItem: any, amount: number, type: string) => {
        const itemToAdd = await ItemFactory.get(shopItem.dbName);
        if(!itemToAdd) return;
        if(amount < 1) {
            playerFuncs.emit.notification(player, `How do you think this would be possible?`);
            return;
        }
        const itemIsInInventory = playerFuncs.inventory.isInInventory(player, { name: itemToAdd.name });
        const emptySlot = playerFuncs.inventory.getFreeInventorySlot(player);
        if (type === 'buy') {
            if (!itemIsInInventory) {
                if(shopItem.price * amount >  player.data.cash) {
                    playerFuncs.emit.notification(player, OSS_TRANSLATIONS.notEnoughCash);
                    return;
                } 
                itemToAdd.quantity = amount;
                playerFuncs.inventory.inventoryAdd(player, itemToAdd, emptySlot.slot);
                playerFuncs.save.field(player, 'inventory', player.data.inventory);
                playerFuncs.sync.inventory(player);
                playerFuncs.currency.sub(player, CurrencyTypes.CASH, amount * shopItem.price);
                playerFuncs.emit.notification(
                    player,
                    `You've bought ${itemToAdd.name} x${amount} for ${shopItem.price * amount}$!`,
                );
                return;
            } else if (itemIsInInventory) {
                if(shopItem.price * amount >  player.data.cash) {
                    playerFuncs.emit.notification(player, OSS_TRANSLATIONS.notEnoughCash);
                    return;
                } 
                player.data.inventory[itemIsInInventory.index].quantity += amount;
                playerFuncs.save.field(player, 'inventory', player.data.inventory);
                playerFuncs.sync.inventory(player);
                playerFuncs.currency.sub(player, CurrencyTypes.CASH, amount * shopItem.price);
                playerFuncs.emit.notification(
                    player,
                    `You've bought ${itemToAdd.name} for ${shopItem.price * amount}$`,
                );
                return;
            }
        } else {
            if (itemIsInInventory) {
                if(amount > player.data.inventory[itemIsInInventory.index].quantity) {
                    playerFuncs.emit.notification(player, `Invalid action.`);
                    return;
                }
                player.data.inventory[itemIsInInventory.index].quantity -= amount;
                if(player.data.inventory[itemIsInInventory.index].quantity <= 1) {
                    playerFuncs.inventory.findAndRemove(player, player.data.inventory[itemIsInInventory.index].name);
                }
                playerFuncs.save.field(player, 'inventory', player.data.inventory);
                playerFuncs.sync.inventory(player);
                playerFuncs.emit.notification(player, `You've sold ${itemToAdd.name} for ${shopItem.price * amount}$`);
                playerFuncs.currency.add(player, CurrencyTypes.CASH, shopItem.price * amount);
                return;
            }
        }
    },
);
