---
title: Athena.systems.dropTable
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [ItemDrop](../interfaces/server_systems_dropTable_ItemDrop.md)

## Functions

### get

::: tip Usage
Athena.systems.dropTable.**get**(`items`, `maximumDrops?`): [`Omit`](server_player_inventory_Internal.md#Omit)<[`player`](server_config.md#player), ``"data"`` \| ``"slot"``\>[]
:::

Given a drop table, roll random items from the table.

Specify maximumDrops, if you want to allow more than `1` item to be pulled.

This can sometimes return `zero` items depending on the odds.

**`Export`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `items` | [`ItemDrop`](../interfaces/server_systems_dropTable_ItemDrop.md)[] | `undefined` |
| `maximumDrops` | `number` | `1` |

#### Returns

[`Omit`](server_player_inventory_Internal.md#Omit)<[`player`](server_config.md#player), ``"data"`` \| ``"slot"``\>[]

#### Defined in

[server/systems/dropTable.ts:68](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/server/systems/dropTable.ts#L68)
