---
title: Athena.systems.inventory.crafting
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_systems_inventory_crafting_Internal.md)

## Interfaces

- [CraftRecipe](../interfaces/server_systems_inventory_crafting_CraftRecipe.md)

## Type Aliases

### ItemCombo

Ƭ **ItemCombo**: [[`dbName`](server_systems_inventory_crafting.md#dbName), [`dbName`](server_systems_inventory_crafting.md#dbName)]

#### Defined in

[server/systems/inventory/crafting.ts:9](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L9)

___

### Quantities

Ƭ **Quantities**: [`number`, `number`]

#### Defined in

[server/systems/inventory/crafting.ts:11](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L11)

___

### dbName

Ƭ **dbName**: `string`

#### Defined in

[server/systems/inventory/crafting.ts:7](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L7)

## Functions

### addRecipe

::: tip Usage
Athena.systems.inventory.crafting.**addRecipe**(`recipe`): `boolean`
:::

Add a recipe in-memory. Does not store to database.

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipe` | [`CraftRecipe`](../interfaces/server_systems_inventory_crafting_CraftRecipe.md) |

#### Returns

`boolean`

#### Defined in

[server/systems/inventory/crafting.ts:101](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L101)

___

### combineItems

::: tip Usage
Athena.systems.inventory.crafting.**combineItems**(`dataSet`, `slot1`, `slot2`, `type`): { `dataSet`: [`player`](server_config.md#player)[] ; `sound?`: `string`  } \| `undefined`
:::

Combine two slots given a data set.
It will attempt to find a matching recipe and make modifications according to the combination.
Returns an object with the modified dataSet, and a sound associated with the crafting recipe if provided in the recipe itself.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataSet` | `StoredItem`[] |
| `slot1` | `number` |
| `slot2` | `number` |
| `type` | ``"inventory"`` \| ``"toolbar"`` \| ``"custom"`` |

#### Returns

{ `dataSet`: [`player`](server_config.md#player)[] ; `sound?`: `string`  } \| `undefined`

#### Defined in

[server/systems/inventory/crafting.ts:173](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L173)

___

### findRecipe

::: tip Usage
Athena.systems.inventory.crafting.**findRecipe**(`combo`): [`CraftRecipe`](../interfaces/server_systems_inventory_crafting_CraftRecipe.md) \| `undefined`
:::

Attempts to find a matching recipe.
If a matching recipe is found; it is returned.
Otherwise, returns undefined.

#### Parameters

| Name | Type |
| :------ | :------ |
| `combo` | [`ItemCombo`](server_systems_inventory_crafting.md#ItemCombo) |

#### Returns

[`CraftRecipe`](../interfaces/server_systems_inventory_crafting_CraftRecipe.md) \| `undefined`

#### Defined in

[server/systems/inventory/crafting.ts:129](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L129)

___

### override

::: tip Usage
Athena.systems.inventory.crafting.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory crafting functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addRecipe"`` |
| `callback` | (`recipe`: [`CraftRecipe`](../interfaces/server_systems_inventory_crafting_CraftRecipe.md)) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/crafting.ts:288](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L288)

::: tip Usage
Athena.systems.inventory.crafting.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory crafting functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"combineItems"`` |
| `callback` | (`dataSet`: `StoredItem`[], `slot1`: `number`, `slot2`: `number`, `type`: ``"inventory"`` \| ``"toolbar"`` \| ``"custom"``) => { `dataSet`: [`player`](server_config.md#player)[] ; `sound?`: `string`  } \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/crafting.ts:289](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L289)

::: tip Usage
Athena.systems.inventory.crafting.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory crafting functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"findRecipe"`` |
| `callback` | (`combo`: [`ItemCombo`](server_systems_inventory_crafting.md#ItemCombo)) => [`CraftRecipe`](../interfaces/server_systems_inventory_crafting_CraftRecipe.md) \| `undefined` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/crafting.ts:290](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/systems/inventory/crafting.ts#L290)
