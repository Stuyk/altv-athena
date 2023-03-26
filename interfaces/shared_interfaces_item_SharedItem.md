---
title: AthenaShared.interfaces.item.SharedItem
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/item](../modules/shared_interfaces_item.md).SharedItem

Shared Item Information for Both Interfaces Below

**`Interface`**

SharedItem

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

## Hierarchy

- **`SharedItem`**

  ↳ [`StoredItem`](shared_interfaces_item_StoredItem.md)

  ↳ [`BaseItem`](shared_interfaces_item_BaseItem.md)

## Properties

### data

• **data**: `CustomData`

Any custom data assigned to this item.

**`Memberof`**

SharedItem

#### Defined in

[shared/interfaces/item.ts:204](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/shared/interfaces/item.ts#L204)

___

### dbName

• **dbName**: `string`

The matching database name for this item.

**`Memberof`**

SharedItem

#### Defined in

[shared/interfaces/item.ts:196](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/shared/interfaces/item.ts#L196)

___

### version

• `Optional` **version**: `number`

The version of this item it is based upon.

**`Memberof`**

SharedItem

#### Defined in

[shared/interfaces/item.ts:212](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/shared/interfaces/item.ts#L212)
