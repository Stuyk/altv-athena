---
title: AthenaShared.interfaces.item.StoredItem
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/item](../modules/shared_interfaces_item.md).StoredItem

The StoredItem is stored in the player in the following locations:
equipment, inventory, and toolbar

**`Interface`**

StoredItem

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

## Hierarchy

- [`SharedItem`](shared_interfaces_item_SharedItem.md)<`CustomData`\>

  ↳ **`StoredItem`**

## Properties

### data

• **data**: `CustomData`

Any custom data assigned to this item.

#### Inherited from

[SharedItem](shared_interfaces_item_SharedItem.md).[data](shared_interfaces_item_SharedItem.md#data)

#### Defined in

[shared/interfaces/item.ts:204](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L204)

___

### dbName

• **dbName**: `string`

The matching database name for this item.

#### Inherited from

[SharedItem](shared_interfaces_item_SharedItem.md).[dbName](shared_interfaces_item_SharedItem.md#dbName)

#### Defined in

[shared/interfaces/item.ts:196](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L196)

___

### disableCrafting

• `Optional` **disableCrafting**: `boolean`

Flag this item as uncraftable. Just in case it has a shared base.

#### Defined in

[shared/interfaces/item.ts:272](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L272)

___

### icon

• `Optional` **icon**: `string`

Specify an icon to override the default base item icon with.

#### Defined in

[shared/interfaces/item.ts:264](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L264)

___

### isEquipped

• `Optional` **isEquipped**: `boolean`

A generic way to flag an item to be equipped.
Equipped can mean anything in the code base; it's up to the user to define its equip usage.

#### Defined in

[shared/interfaces/item.ts:248](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L248)

___

### quantity

• **quantity**: `number`

The amount of this item the player has.

#### Defined in

[shared/interfaces/item.ts:231](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L231)

___

### slot

• **slot**: `number`

Where this item should be displayed in a toolbar, equipment bar, or inventory bar.

#### Defined in

[shared/interfaces/item.ts:239](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L239)

___

### totalWeight

• `Optional` **totalWeight**: `number`

The weight calculated for this item.

#### Defined in

[shared/interfaces/item.ts:256](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L256)

___

### version

• `Optional` **version**: `number`

The version of this item it is based upon.

#### Inherited from

[SharedItem](shared_interfaces_item_SharedItem.md).[version](shared_interfaces_item_SharedItem.md#version)

#### Defined in

[shared/interfaces/item.ts:212](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/shared/interfaces/item.ts#L212)
