---
title: Athena.systems.storage.StorageInstance
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/storage](../modules/server_systems_storage.md).StorageInstance

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomData` | {} |

## Properties

### \_id

• `Optional` **\_id**: `unknown`

#### Defined in

[server/systems/storage.ts:14](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/server/systems/storage.ts#L14)

___

### items

• **items**: `StoredItem`<`CustomData`\>[]

The data stored in the database.

#### Defined in

[server/systems/storage.ts:30](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/server/systems/storage.ts#L30)

___

### lastUsed

• **lastUsed**: `number`

The date which this storage was last accessed.

#### Defined in

[server/systems/storage.ts:22](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/server/systems/storage.ts#L22)
