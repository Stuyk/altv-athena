---
title: Athena.systems.inventory.equip
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### invoke

::: tip Usage
Athena.systems.inventory.equip.**invoke**(`event`, `player`, `item`): `void`
:::

Invoke a specific event for listening to a specific item type being equipped / unequipped

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `number` |
| `player` | `Player` |
| `item` | `StoredItem` |

#### Returns

`void`

#### Defined in

[server/systems/inventory/equip.ts:22](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/server/systems/inventory/equip.ts#L22)

___

### on

::: tip Usage
Athena.systems.inventory.equip.**on**<`T`\>(`event`, `dbName`, `cb`): `void`
:::

Listen for a when a specific item is equipped or unequipped

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `number` |
| `dbName` | `string` |
| `cb` | (`player`: `Player`, `item`: `StoredItemEx`<`T`\>) => `void` |

#### Returns

`void`

#### Defined in

[server/systems/inventory/equip.ts:42](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/server/systems/inventory/equip.ts#L42)
