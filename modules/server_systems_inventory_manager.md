---
title: Athena.systems.inventory.manager
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [ItemQuantityChange](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md)

## Type Aliases

### ComplexSwap

Ƭ **ComplexSwap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | [`player`](server_config.md#player)[] |
| `size` | [`InventoryType`](server_systems_inventory_manager.md#InventoryType) \| `number` |
| `slot` | `number` |
| `type` | [`InventoryType`](server_systems_inventory_manager.md#InventoryType) |

#### Defined in

[server/systems/inventory/manager.ts:28](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L28)

___

### ComplexSwapReturn

Ƭ **ComplexSwapReturn**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `from` | [`player`](server_config.md#player)[] |
| `to` | [`player`](server_config.md#player)[] |

#### Defined in

[server/systems/inventory/manager.ts:29](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L29)

___

### InventoryType

Ƭ **InventoryType**: ``"inventory"`` \| ``"toolbar"`` \| ``"custom"``

#### Defined in

[server/systems/inventory/manager.ts:27](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L27)

## Functions

### add

::: tip Usage
Athena.systems.inventory.manager.**add**<`CustomData`\>(`item`, `data`, `size?`): [`player`](server_config.md#player)[] \| `undefined`
:::

Adds or stacks an item based on the quantity passed.
Requires the basic version of a stored item to be added to a user.
Returns undefined if the data set could not be modified to include the quantity of items necessary.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `item` | [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`<`CustomData`\>, ``"slot"``\> | `undefined` | - |
| `data` | `StoredItem`[] | `undefined` |  |
| `size` | `number` \| [`InventoryType`](server_systems_inventory_manager.md#InventoryType) | `256` | The maximum slot size for this item group. |

#### Returns

[`player`](server_config.md#player)[] \| `undefined`

Returns undefined or the new array of added items.

#### Defined in

[server/systems/inventory/manager.ts:312](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L312)

___

### addQuantity

::: tip Usage
Athena.systems.inventory.manager.**addQuantity**(`item`, `amount`): [`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md) \| `undefined`
:::

Adds a quantity to a specified item.
Utilizes the base item to determine maximum stack.
Will return the remaining amount that was not added if a max stack size is present.
Will return undefined if the base item does not exist, or if the item simply cannot have quantity changed.
Recalculated weight on item if baseItem has weight present.

If you wish to modify a full item use `add<Item>(...)`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `amount` | `number` |

#### Returns

[`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md) \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:158](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L158)

___

### calculateItemWeight

::: tip Usage
Athena.systems.inventory.manager.**calculateItemWeight**(`baseItem`, `storedItem`): [`player`](server_config.md#player)
:::

Calculate the total weight of the item, and return the modified item with total weight.

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseItem` | `BaseItem` |
| `storedItem` | `StoredItem` |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[server/systems/inventory/manager.ts:38](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L38)

___

### clearData

::: tip Usage
Athena.systems.inventory.manager.**clearData**(`item`): `any`
:::

Clears the data field of the item.
Sets it to an empty object.
Always returns a new item with the modified contents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:270](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L270)

___

### combineAt

::: tip Usage
Athena.systems.inventory.manager.**combineAt**(`fromSlot`, `toSlot`, `data`): [`player`](server_config.md#player)[] \| `undefined`
:::

Combines items from two different slots into a single slot.
It's like a stack method.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fromSlot` | `number` |
| `toSlot` | `number` |
| `data` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)[] \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:541](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L541)

___

### combineAtComplex

::: tip Usage
Athena.systems.inventory.manager.**combineAtComplex**(`from`, `to`): [`ComplexSwapReturn`](server_systems_inventory_manager.md#ComplexSwapReturn) \| `undefined`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap) |
| `to` | [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap) |

#### Returns

[`ComplexSwapReturn`](server_systems_inventory_manager.md#ComplexSwapReturn) \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:593](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L593)

___

### compare

::: tip Usage
Athena.systems.inventory.manager.**compare**(`firstItem`, `secondItem`): `boolean`
:::

Compare two items to check if they are the same version.

#### Parameters

| Name | Type |
| :------ | :------ |
| `firstItem` | `StoredItem` |
| `secondItem` | `StoredItem` |

#### Returns

`boolean`

#### Defined in

[server/systems/inventory/manager.ts:924](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L924)

___

### convertFromStored

::: tip Usage
Athena.systems.inventory.manager.**convertFromStored**(`data`): [`player`](server_config.md#player)<[`player`](server_config.md#player), {}\>[]
:::

Convert an array of stored items into full items

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `StoredItem`<{}\>[] |

#### Returns

[`player`](server_config.md#player)<[`player`](server_config.md#player), {}\>[]

#### Defined in

[server/systems/inventory/manager.ts:287](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L287)

___

### hasItem

::: tip Usage
Athena.systems.inventory.manager.**hasItem**(`dataSet`, `dbName`, `quantity`, `version?`): `boolean`
:::

Check if the player has enough of an item in a given data set.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dataSet` | `StoredItem`[] | `undefined` |
| `dbName` | `string` | `undefined` |
| `quantity` | `number` | `undefined` |
| `version?` | `number` | `undefined` |

#### Returns

`boolean`

#### Defined in

[server/systems/inventory/manager.ts:193](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L193)

___

### modifyItemQuantity

::: tip Usage
Athena.systems.inventory.manager.**modifyItemQuantity**(`item`, `amount`, `isRemoving?`): [`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md)
:::

Modifies an item by adding or removing an amount.

The amount that did not get removed, or added is returned.

If the base item of the item is not found it will return undefined.

It will automatically re-calculate weight if the baseItem weight is present.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | `any` | `undefined` |
| `amount` | `number` | `undefined` |
| `isRemoving?` | `boolean` | `false` |

#### Returns

[`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md)

#### Defined in

[server/systems/inventory/manager.ts:66](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L66)

___

### override

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | <CustomData\>(`item`: [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`<`CustomData`\>, ``"slot"``\>, `data`: `StoredItem`[], `size`: `number` \| [`InventoryType`](server_systems_inventory_manager.md#InventoryType)) => [`player`](server_config.md#player)[] \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:976](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L976)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addQuantity"`` |
| `callback` | (`item`: `any`, `amount`: `number`) => [`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:977](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L977)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"calculateItemWeight"`` |
| `callback` | (`baseItem`: `BaseItem`, `storedItem`: `StoredItem`) => [`player`](server_config.md#player) |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:978](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L978)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clearData"`` |
| `callback` | (`item`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:979](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L979)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"combineAt"`` |
| `callback` | (`fromSlot`: `number`, `toSlot`: `number`, `data`: `StoredItem`[]) => [`player`](server_config.md#player)[] \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:980](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L980)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"combineAtComplex"`` |
| `callback` | (`from`: [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap), `to`: [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap)) => [`ComplexSwapReturn`](server_systems_inventory_manager.md#ComplexSwapReturn) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:981](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L981)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"compare"`` |
| `callback` | (`firstItem`: `StoredItem`, `secondItem`: `StoredItem`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:982](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L982)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"convertFromStored"`` |
| `callback` | (`data`: `StoredItem`<{}\>[]) => [`player`](server_config.md#player)<[`player`](server_config.md#player), {}\>[] |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:983](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L983)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"hasItem"`` |
| `callback` | (`dataSet`: `StoredItem`[], `dbName`: `string`, `quantity`: `number`, `version?`: `number`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:984](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L984)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"modifyItemQuantity"`` |
| `callback` | (`item`: `any`, `amount`: `number`, `isRemoving?`: `boolean`) => [`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md) |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:985](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L985)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeZeroQuantityItems"`` |
| `callback` | (`items`: `any`[]) => ([`player`](server_config.md#player) \| [`player`](server_config.md#player))[] |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:986](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L986)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setData"`` |
| `callback` | <DataType\>(`item`: `any`, `data`: `DataType`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:987](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L987)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"splitAt"`` |
| `callback` | (`slot`: `number`, `data`: `StoredItem`[], `splitCount`: `number`, `dataSize`: `number` \| [`InventoryType`](server_systems_inventory_manager.md#InventoryType)) => [`player`](server_config.md#player)[] \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:988](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L988)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sub"`` |
| `callback` | <CustomData\>(`item`: [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`<`CustomData`\>, ``"slot"`` \| ``"data"``\>, `data`: `StoredItem`[]) => [`player`](server_config.md#player)[] \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:989](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L989)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"subQuantity"`` |
| `callback` | (`item`: `any`, `amount`: `number`) => [`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:990](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L990)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"swap"`` |
| `callback` | (`fromSlot`: `number`, `toSlot`: `number`, `data`: `StoredItem`[], `dataSize`: `number` \| [`InventoryType`](server_systems_inventory_manager.md#InventoryType)) => [`player`](server_config.md#player)[] \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:991](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L991)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"swapBetween"`` |
| `callback` | (`from`: [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap), `to`: [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap)) => [`ComplexSwapReturn`](server_systems_inventory_manager.md#ComplexSwapReturn) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:992](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L992)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleItem"`` |
| `callback` | (`player`: `Player`, `slot`: `number`, `type`: [`InventoryType`](server_systems_inventory_manager.md#InventoryType)) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:993](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L993)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"upsertData"`` |
| `callback` | <DataType\>(`item`: `any`, `data`: `DataType`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:994](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L994)

::: tip Usage
Athena.systems.inventory.manager.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item manager functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"useItem"`` |
| `callback` | (`player`: `Player`, `slot`: `number`, `type?`: ``"inventory"`` \| ``"toolbar"``, `eventToCall`: `string` \| `string`[]) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:995](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L995)

___

### removeZeroQuantityItems

::: tip Usage
Athena.systems.inventory.manager.**removeZeroQuantityItems**(`items`): ([`player`](server_config.md#player) \| [`player`](server_config.md#player))[]
:::

Remove all items with zero quantity.

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `any`[] |

#### Returns

([`player`](server_config.md#player) \| [`player`](server_config.md#player))[]

#### Defined in

[server/systems/inventory/manager.ts:123](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L123)

___

### setData

::: tip Usage
Athena.systems.inventory.manager.**setData**<`DataType`\>(`item`, `data`): `any`
:::

Assign data to the data field.

Always returns a new item with the modified contents.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `data` | `DataType` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:246](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L246)

___

### splitAt

::: tip Usage
Athena.systems.inventory.manager.**splitAt**(`slot`, `data`, `splitCount`, `dataSize?`): [`player`](server_config.md#player)[] \| `undefined`
:::

Split an item into a new item given the slot number, and a split size.

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `number` |
| `data` | `StoredItem`[] |
| `splitCount` | `number` |
| `dataSize` | `number` \| [`InventoryType`](server_systems_inventory_manager.md#InventoryType) |

#### Returns

[`player`](server_config.md#player)[] \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:474](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L474)

___

### sub

::: tip Usage
Athena.systems.inventory.manager.**sub**<`CustomData`\>(`item`, `data`): [`player`](server_config.md#player)[] \| `undefined`
:::

Subtract an item quantity from a data set.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Omit`](server_player_inventory_Internal.md#Omit)<`StoredItem`<`CustomData`\>, ``"slot"`` \| ``"data"``\> |
| `data` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)[] \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:413](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L413)

___

### subQuantity

::: tip Usage
Athena.systems.inventory.manager.**subQuantity**(`item`, `amount`): [`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md) \| `undefined`
:::

Removes a quantity from a specified item.
Will return the remaining amount that was not removed if amount exceeds available in stack size.
Will return undefined if the base item does not exist, or if the item simply cannot have quantity changed.

If you wish to modify a full item use `remove<Item>(...)`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `amount` | `number` |

#### Returns

[`ItemQuantityChange`](../interfaces/server_systems_inventory_manager_ItemQuantityChange.md) \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:177](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L177)

___

### swap

::: tip Usage
Athena.systems.inventory.manager.**swap**(`fromSlot`, `toSlot`, `data`, `dataSize?`): [`player`](server_config.md#player)[] \| `undefined`
:::

Swaps slots between a single data set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fromSlot` | `number` |
| `toSlot` | `number` |
| `data` | `StoredItem`[] |
| `dataSize` | `number` \| [`InventoryType`](server_systems_inventory_manager.md#InventoryType) |

#### Returns

[`player`](server_config.md#player)[] \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:662](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L662)

___

### swapBetween

::: tip Usage
Athena.systems.inventory.manager.**swapBetween**(`from`, `to`): [`ComplexSwapReturn`](server_systems_inventory_manager.md#ComplexSwapReturn) \| `undefined`
:::

Swap items between two different data sets; with a given size.

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap) |
| `to` | [`ComplexSwap`](server_systems_inventory_manager.md#ComplexSwap) |

#### Returns

[`ComplexSwapReturn`](server_systems_inventory_manager.md#ComplexSwapReturn) \| `undefined`

#### Defined in

[server/systems/inventory/manager.ts:710](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L710)

___

### toggleItem

::: tip Usage
Athena.systems.inventory.manager.**toggleItem**(`player`, `slot`, `type`): `Promise`<`boolean`\>
:::

Toggles the isEquipped boolean in a stored item.
If the boolean is undefined; it will change to true.
Automatically saves.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `slot` | `number` |  |
| `type` | [`InventoryType`](server_systems_inventory_manager.md#InventoryType) | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/inventory/manager.ts:850](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L850)

___

### upsertData

::: tip Usage
Athena.systems.inventory.manager.**upsertData**<`DataType`\>(`item`, `data`): `any`
:::

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DataType` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `data` | `DataType` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:219](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L219)

___

### useItem

::: tip Usage
Athena.systems.inventory.manager.**useItem**(`player`, `slot`, `type?`, `eventToCall?`): `any`
:::

Invokes an item use effect

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `slot` | `number` | `undefined` |  |
| `type?` | ``"inventory"`` \| ``"toolbar"`` | `'toolbar'` |  |
| `eventToCall` | `string` \| `string`[] | `undefined` | - |

#### Returns

`any`

#### Defined in

[server/systems/inventory/manager.ts:783](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/server/systems/inventory/manager.ts#L783)
