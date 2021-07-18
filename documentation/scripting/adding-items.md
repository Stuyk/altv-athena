---
description: Learn how to add items to your game mode.
---

# Adding Items

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
