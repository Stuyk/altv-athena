---
title: Athena.systems.inventory.weapons
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### get

::: Tip
Athena.systems.inventory.weapons.**get**(`dataSet`): [`player`](server_config.md#player)[]
:::

Return all weapons from a given data set.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataSet` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/systems/inventory/weapons.ts:13](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/systems/inventory/weapons.ts#L13)

___

### override

::: Tip
Athena.systems.inventory.weapons.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item weapon functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/weapons.ts:117](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/systems/inventory/weapons.ts#L117)

___

### removeAll

::: Tip
Athena.systems.inventory.weapons.**removeAll**(`dataSet`): [`player`](server_config.md#player)[]
:::

Remove all weapons from a given data set.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataSet` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/systems/inventory/weapons.ts:40](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/systems/inventory/weapons.ts#L40)

___

### update

::: Tip
Athena.systems.inventory.weapons.**update**(`player`): `any`
:::

Looks into the item toolbar and determines what weapons to equip / unequip.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/systems/inventory/weapons.ts:63](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/systems/inventory/weapons.ts#L63)
