---
description: >-
    Learn how to add items to your game mode.
---

# Adding Items

Items come in a variety of flavors but their general creation follows a specific template.

```ts
const refItem: Item = {
    name: `Micro SMG`,
    uuid: `some_hash_thing`,
    description: `Debug: Should be able to go to toolbar. Cannot go to equipment. Is a weapon.`,
    icon: 'gun',
    slot: 4,
    quantity: 1,
    weight: 2,
    behavior: ItemType.CAN_DROP | ItemType.CAN_TRADE | ItemType.IS_TOOLBAR | ItemType.IS_WEAPON,
    data: {
        hash: 0x13532244 // Used as the weapon hash for giving the player a weapon
    }
};
```

Now when you create templates for items and want to use a reference item like the one above. You must perform a deep copy of that item reference.

```ts
const newItem: Item = deepCloneObject<Item>(refItem);
```

After making the deepl clone of your object you can modify it.

```ts
newItem.name = `Super Cool Item`;
newItem.icon = 'crate';
```

## Giving Players Items

More often than not the one location you will be putting new items in the player's inventory. Athena comes with a handful of utility functions to help you add and remove items from a player's inventory.

Here's the basic gist of it.

```ts
const slotInfo = playerFuncs.inventory.getFreeInventorySlot(player);
playerFuncs.inventory.inventoryAdd(player, newItem, slotInfo.slot, slotInfo.tab);

// Don't forget to save the inventory after adding it.
playerFuncs.save.field(player, 'inventory', player.data.inventory);
```

## Removing Players Items

If you need to remove a player's item you can run the following functions to check if it is removed.

```ts
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
