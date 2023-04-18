---
title: Athena.systems.inventory.events.Internal.InventoryEventCallbacks
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[server/systems/inventory/events](../modules/server_systems_inventory_events.md).[Internal](../modules/server_systems_inventory_events_Internal.md).InventoryEventCallbacks

## Methods

### onDrop

::: tip Usage
Athena.systems.inventory.events.Internal.InventoryEventCallbacks.**onDrop**(`player`, `dbName`, `slot`): `void`
:::

Invoked when a player has dropped an item.

**`Memberof`**

InventoryEventCallbacks

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `dbName` | `string` |
| `slot` | `number` |

#### Returns

`void`

#### Defined in

[server/systems/inventory/events.ts:12](https://github.com/Stuyk/altv-athena/blob/492641c/src/core/server/systems/inventory/events.ts#L12)
