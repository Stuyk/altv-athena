---
title: Athena.systems.inventory.events
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_systems_inventory_events_Internal.md)

## Functions

### invoke

::: tip Usage
Athena.systems.inventory.events.**invoke**<`K`\>(`player`, `event`, `...args`): `void`
:::

Invoke an inventory event.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"onDrop"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `event` | `K` |
| `...args` | [`InventoryEventTriggers`](../interfaces/server_systems_inventory_events_Internal_InventoryEventTriggers.md)[`K`] |

#### Returns

`void`

#### Defined in

[server/systems/inventory/events.ts:35](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/inventory/events.ts#L35)

___

### on

::: tip Usage
Athena.systems.inventory.events.**on**<`K`\>(`event`, `callback`): `void`
:::

Listen for an invoked inventory event.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"onDrop"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `K` |
| `callback` | [`InventoryEventCallbacks`](../interfaces/server_systems_inventory_events_Internal_InventoryEventCallbacks.md)[`K`] |

#### Returns

`void`

#### Defined in

[server/systems/inventory/events.ts:57](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/server/systems/inventory/events.ts#L57)
