import alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';

Athena.systems.messenger.commands.register(
    'additem',
    '/additem [dbName] [amount] [version?]',
    ['admin'],
    async (player: alt.Player, dbName: string, amount: string, version: string | undefined) => {
        if (typeof dbName === 'undefined') {
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

        const result = await Athena.player.inventory.add(player, {
            dbName,
            quantity: actualAmount,
            data: {},
            version: actualVersion,
        });

        if (!result) {
            Athena.player.emit.notification(player, `Could not add. Inventory full?`);
            return;
        }

        Athena.player.emit.notification(player, `Item Added`);
    },
);

Athena.systems.messenger.commands.register(
    'removeitem',
    '/removeitem [dbName] [amount] [version?]',
    ['admin'],
    async (player: alt.Player, dbName: string, amount: string, version: string | undefined) => {
        if (typeof dbName === 'undefined') {
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

        const result = await Athena.player.inventory.sub(player, {
            dbName,
            quantity: actualAmount,
            data: {},
            version: actualVersion,
        });

        if (!result) {
            Athena.player.emit.notification(player, `Could not remove?`);
            return;
        }

        Athena.player.emit.notification(player, `Item Removed`);
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
