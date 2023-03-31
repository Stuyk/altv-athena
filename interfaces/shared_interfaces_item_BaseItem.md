---
title: AthenaShared.interfaces.item.BaseItem
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/item](../modules/shared_interfaces_item.md).BaseItem

The BaseItem is used as a way for the main items to point towards item information.
This item stored in the database is used to construct front facing item information.

**`Interface`**

BaseItem

## Type parameters

| Name | Type |
| :------ | :------ |
| `Behavior` | [`DefaultItemBehavior`](shared_interfaces_item_DefaultItemBehavior.md) |
| `CustomData` | {} |

## Hierarchy

- [`SharedItem`](shared_interfaces_item_SharedItem.md)<`CustomData`\>

  ↳ **`BaseItem`**

## Properties

### \_id

• `Optional` **\_id**: `unknown`

Database entry for item. Do not add / append.

#### Defined in

[shared/interfaces/item.ts:302](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L302)

___

### behavior

• `Optional` **behavior**: `Behavior`

Behavior associated with this item.

#### Defined in

[shared/interfaces/item.ts:343](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L343)

___

### consumableEventToCall

• `Optional` **consumableEventToCall**: `string` \| `string`[]

The event to call when this item is consumed.

#### Defined in

[shared/interfaces/item.ts:351](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L351)

___

### customEventsToCall

• `Optional` **customEventsToCall**: [`CustomContextAction`](shared_interfaces_item_CustomContextAction.md)[]

Custom context actions in addition to the standard consumable event.

#### Defined in

[shared/interfaces/item.ts:359](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L359)

___

### data

• **data**: `CustomData`

Any custom data assigned to this item.

#### Inherited from

[SharedItem](shared_interfaces_item_SharedItem.md).[data](shared_interfaces_item_SharedItem.md#data)

#### Defined in

[shared/interfaces/item.ts:204](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L204)

___

### dbName

• **dbName**: `string`

The matching database name for this item.

#### Inherited from

[SharedItem](shared_interfaces_item_SharedItem.md).[dbName](shared_interfaces_item_SharedItem.md#dbName)

#### Defined in

[shared/interfaces/item.ts:196](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L196)

___

### icon

• **icon**: `string`

A client-side icon name.
They are specified and created by you.

#### Defined in

[shared/interfaces/item.ts:319](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L319)

___

### maxStack

• `Optional` **maxStack**: `number`

If this value is defined it will be used as the maximum stack size for the item.

#### Defined in

[shared/interfaces/item.ts:327](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L327)

___

### model

• `Optional` **model**: `string`

The drop model of this item when it is on the ground.
If not defined it will default to a box of some sort.

#### Defined in

[shared/interfaces/item.ts:368](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L368)

___

### msTimeout

• `Optional` **msTimeout**: `number`

An expiration time in milliseconds before the item drop is cleared.
Stored items come with an expiration date.

#### Defined in

[shared/interfaces/item.ts:377](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L377)

___

### name

• **name**: `string`

The name of this item.

#### Defined in

[shared/interfaces/item.ts:310](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L310)

___

### version

• `Optional` **version**: `number`

The version of this item it is based upon.

#### Inherited from

[SharedItem](shared_interfaces_item_SharedItem.md).[version](shared_interfaces_item_SharedItem.md#version)

#### Defined in

[shared/interfaces/item.ts:212](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L212)

___

### weight

• `Optional` **weight**: `number`

The weight of this item.

#### Defined in

[shared/interfaces/item.ts:335](https://github.com/Stuyk/altv-athena/blob/a3c2264/src/core/shared/interfaces/item.ts#L335)
