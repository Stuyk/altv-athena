---
description: Learn how to add items to your game mode.
---

# Adding Items

 [Keywords and Inventory Syntax](#keywords-and-inventory-syntax)
- [Adding Items](#adding-items)
- [Video Guide](#video-guide)
- [Keywords and Inventory Syntax](#keywords-and-inventory-syntax)
- [Difference Between Slot and Index](#difference-between-slot-and-index)
- [Using Inventory Functions](#using-inventory-functions)
- [Deep Cloning Objects](#deep-cloning-objects)
- [Add / Create Items](#add--create-items)
  - [Giving Players Items](#giving-players-items)
  - [Removing Players Items](#removing-players-items)
  - [Working with Player Inventories](#working-with-player-inventories)
  - [Item Effects](#item-effects)
    - [Item Example](#item-example)
    - [Item Effect Receive](#item-effect-receive)

# Video Guide

[![Item Creation Video](https://img.youtube.com/vi/dPztbrxcqQ8/0.jpg)](https://www.youtube.com/watch?v=dPztbrxcqQ8)


# Keywords and Inventory Syntax

The inventory is setup in a way to have multiple pages. Which means it is an array of array(s). Which is a bit of a weird concept if you're only used to a single array of items.

What this means is that each array inside of the inventory has the items in it.

So accessing individual items for a player is something like...

```ts
player.data.inventory[0][0]
```

This will get the first `tab` or `page` of the player's inventory and the first `item` in the `tab` or `page`.

Here's what they may look like from a visual perspective.

```ts
[
    [
        {
            name: 'Burger',
            description: 'A delicious burger...',
            quantity: 1,
            slot: 0
        }
    ],
    [],
    [],
    [],
    [],
    [],
    [
        {
            name: 'Taco',
            description: 'A classic Mexican street taco.',
            quantity: 0,
            slot: 5
        }
    ]
]
```

# Difference Between Slot and Index

Slot is where the item is placed when the item is displayed to the user.

Index is where the item is placed inside of the array.

If a function returns an index for an inventory item then it means you can get the item like...

```ts
player.data.inventory[someTabNumber][index]
```

If the function returns a slot for an inventory item. Then it means you need to get it like this...

```ts
const item = player.data.inventory[someTabNumber].find(x => x.slot === someSlotNumber);
```

# Using Inventory Functions

The inventory does not always save after each update. If you use any inventory functions you should be throwing a save.

```ts
playerFuncs.save.field(player, 'inventory', player.data.inventory);
```

# Deep Cloning Objects

Because these objects can be rather complicated there is a simple function that does a deep clone of an object and ensuring that you're not modifying the original data. You should always deep clone an object before adding it to a player inventory to prevent data from referencing other inventories and such.

```ts
const item = deepCloneObject(originalItem) as Item;
// Then add the item somewhere...
```

# Add / Create Items

Items come in a variety of flavors but their general creation follows a specific template.

```typescript
const refItem: Item = {
    name: `Micro SMG`,
    uuid: `some_hash_thing`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'gun',
    slot: 4,
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.IS_TOOLBAR | ITEM_TYPE.IS_WEAPON,
    data: {
        hash: 0x13532244 // Used as the weapon hash for giving the player a weapon
    }
};
```

Now when you create templates for items and want to use a reference item like the one above. You must perform a deep copy of that item reference.

```typescript
const newItem: Item = deepCloneObject<Item>(refItem);
```

After making the deepl clone of your object you can modify it.

```typescript
newItem.name = `Super Cool Item`;
newItem.icon = 'crate';
```

## Giving Players Items

More often than not the one location you will be putting new items in the player's inventory. Athena comes with a handful of utility functions to help you add and remove items from a player's inventory.

Here's the basic gist of it.

```typescript
const slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
playerFuncs.inventory.inventoryAdd(player, newItem, slotInfo.slot, slotInfo.tab);

// Don't forget to save the inventory after adding it.
playerFuncs.save.field(player, 'inventory', player.data.inventory);
```

## Removing Players Items

If you need to remove a player's item you can run the following functions to check if it is removed.

```typescript
const slotInfo: { slot: number; tab: number } | null = playerFuncs.inventory.isInInventory({ name: 'Micro SMG' });
if (!slotInfo) {
    playerFuncs.emit.message(player, `Item was not found!`);
    return;
}

const item: Item = playerFuncs.inventory.getInventoryItem(player, slotInfo.slot, slotInfo.tab);
if (!item) {
    playerFuncs.emit.message(player, `Item was not found!`);
    return;
}

const didRemoveItem: boolean = playerFuncs.inventory.inventoryRemove(player, slotInfo.slot, slotInfo.tab);
if (!didRemoveItem) {
    playerFuncs.emit.message(player, `Did not find item to remove!`);
    return;
}

alt.log(`The item was removed!`);
```

## Working with Player Inventories

Depending on what you want to do with the player inventory there are a ton of ways to work with it. However, more often than not the most common use case for working with an inventory is finding an item and removing it. Which is what we'll be covering here.

```ts
import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';

function findPlayerBurgerItem(player: alt.Player) {
    const someItemInfo = playerFuncs.inventory.isInInventory(player, { name: 'Burger' });
    if (!someItemInfo) {
        // Item does not exist.
        return;
    }

    const item = player.data.inventory[someItemInfo.tab][someItemInfo.index];
    console.log(item);
}

// Removes an item based on the `slot` of the item.
function removePlayerBurgerItem(player: alt.Player, tab: number, slot: number) {
    playerFuncs.inventory.inventoryRemove(player, slot, tab);
}
```

## Item Effects

If you wish to use item effects when you consume an item it's quite simple.

You will need to add a `event` to the `data` section of your item.

When the item is consumed it will reduce the quantity by `1` and then call that event over `alt.emit`.

It can then be recieved with `alt.on`.

### Item Example

```typescript
const teleporterItem: Item = {
    name: `Teleporter`,
    uuid: `teleporter`,
    description: `Debug: Should be able to call an event with this`,
    icon: 'teleporter',
    slot: 5,
    quantity: 1,
    behavior: ITEM_TYPE.CAN_DROP | ITEM_TYPE.CAN_TRADE | ITEM_TYPE.CONSUMABLE,
    data: {
        event: 'effect:Teleport'
    }
};
```

### Item Effect Receive

```typescript
import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import { Item } from '../../shared/interfaces/Item';

alt.on('effect:Teleport', (player: alt.Player, item: Item) => {
    playerFuncs.emit.message(player, `You consumed ${item.name}`);
});
```
