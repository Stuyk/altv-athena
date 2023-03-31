---
title: Athena.systems.inventory.weapons
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addComponent

::: tip Usage
Athena.systems.inventory.weapons.**addComponent**(`player`, `type`, `slot`, `component`): `Promise`<`boolean`\>
:::

Add a weapon component to a weapon at a given slot.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `type` | ``"inventory"`` \| ``"toolbar"`` |
| `slot` | `number` |
| `component` | `string` \| `number` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/systems/inventory/weapons.ts:67](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/inventory/weapons.ts#L67)

___

### get

::: tip Usage
Athena.systems.inventory.weapons.**get**(`dataSet`): [`player`](server_config.md#player)[]
:::

Return all weapons from a given data set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataSet` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/systems/inventory/weapons.ts:13](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/inventory/weapons.ts#L13)

___

### override

::: tip Usage
Athena.systems.inventory.weapons.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item weapon functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/weapons.ts:160](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/inventory/weapons.ts#L160)

___

### removeAll

::: tip Usage
Athena.systems.inventory.weapons.**removeAll**(`dataSet`): [`player`](server_config.md#player)[]
:::

Remove all weapons from a given data set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataSet` | `StoredItem`[] |

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/systems/inventory/weapons.ts:40](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/inventory/weapons.ts#L40)

___

### update

::: tip Usage
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

[server/systems/inventory/weapons.ts:106](https://github.com/Stuyk/altv-athena/blob/acd5f2f/src/core/server/systems/inventory/weapons.ts#L106)
