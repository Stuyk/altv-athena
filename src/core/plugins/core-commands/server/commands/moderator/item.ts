import alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';

Athena.systems.messenger.commands.register(
    'additem',
    '/additem [dbName] [amount] [version?]',
    ['admin'],
    (player: alt.Player, itemName: string, amount: string, version: string | undefined) => {
        if (typeof itemName === 'undefined') {
            Athena.player.emit.message(player, `Must specify a dbName to add an item.`);
            return;
        }

        if (typeof amount === 'undefined') {
            Athena.player.emit.message(player, `Must specify an amount to add.`);
            return;
        }

        const actualAmount = parseInt(amount);
        if (isNaN(actualAmount)) {
            Athena.player.emit.message(player, `Amount is not a number.`);
            return;
        }

        let actualVersion = undefined;
        if (typeof version !== 'undefined') {
            actualVersion = parseInt(version);
            if (isNaN(actualVersion)) {
                Athena.player.emit.message(player, `Version must be a number.`);
                return;
            }
        }

        const baseItem = Athena.systems.itemFactory.sync.getBaseItem(itemName, actualVersion);
        if (typeof baseItem === 'undefined') {
            Athena.player.emit.message(player, `Item does not exist.`);
            return;
        }

        const data = Athena.document.character.get(player);
        const storedItem = Athena.systems.itemFactory.sync.item.convert.fromBaseToStored(baseItem, actualAmount);
        const modifiedData = Athena.systems.itemManager.inventory.add(storedItem, data.inventory, 'inventory');
        if (typeof modifiedData === 'undefined') {
            Athena.player.emit.message(player, `Could not add item, inventory may be full.`);
            return;
        }

        Athena.document.character.set(player, 'inventory', modifiedData);
        Athena.player.emit.message(player, `Item was added.`);
    },
);

Athena.systems.messenger.commands.register(
    'removeitem',
    '/removeitem [dbName] [amount] [version?]',
    ['admin'],
    (player: alt.Player, itemName: string, amount: string, version: string | undefined) => {
        if (typeof itemName === 'undefined') {
            Athena.player.emit.message(player, `Must specify a dbName to remove an item.`);
            return;
        }

        if (typeof amount === 'undefined') {
            Athena.player.emit.message(player, `Must specify an amount to remove.`);
            return;
        }

        const actualAmount = parseInt(amount);
        if (isNaN(actualAmount)) {
            Athena.player.emit.message(player, `Amount is not a number.`);
            return;
        }

        let actualVersion = undefined;
        if (typeof version !== 'undefined') {
            actualVersion = parseInt(version);
            if (isNaN(actualVersion)) {
                Athena.player.emit.message(player, `Version must be a number.`);
                return;
            }
        }

        const baseItem = Athena.systems.itemFactory.sync.getBaseItem(itemName, actualVersion);
        if (typeof baseItem === 'undefined') {
            Athena.player.emit.message(player, `Item does not exist.`);
            return;
        }

        const data = Athena.document.character.get(player);
        const storedItem = Athena.systems.itemFactory.sync.item.convert.fromBaseToStored(baseItem, actualAmount);
        storedItem.quantity = actualAmount;

        const modifiedData = Athena.systems.itemManager.inventory.sub(storedItem, data.inventory);
        if (typeof modifiedData === 'undefined') {
            Athena.player.emit.message(player, `Could not remove item, item may not have been found in inventory.`);
            return;
        }

        Athena.document.character.set(player, 'inventory', modifiedData);
        Athena.player.emit.message(player, `Item was removed.`);
    },
);

async function exampleItems() {
    Athena.systems.itemFactory.async.upsert({
        dbName: 'burger',
        data: { health: 5 },
        icon: 'burger',
        name: 'Burger',
        maxStack: 8,
        weight: 1,
        behavior: { canDrop: true, canStack: true, canTrade: true, destroyOnDrop: false, isToolbar: true },
        consumableEventToCall: 'edible',
    });
}

exampleItems();
