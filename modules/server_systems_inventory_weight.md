---
title: Athena.systems.inventory.weight
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### getDataWeight

::: tip Usage
Athena.systems.inventory.weight.**getDataWeight**(`data`): `number`
:::

Returns the total weight of a given data set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any`[] |

#### Returns

`number`

#### Defined in

[server/systems/inventory/weight.ts:11](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/weight.ts#L11)

___

### getTotalWeight

::: tip Usage
Athena.systems.inventory.weight.**getTotalWeight**(`dataSets`): `number`
:::

Get the total weight for given data sets.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataSets` | `any`[][] |

#### Returns

`number`

#### Defined in

[server/systems/inventory/weight.ts:34](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/weight.ts#L34)

___

### isWeightExceeded

::: tip Usage
Athena.systems.inventory.weight.**isWeightExceeded**(`dataSets`, `amount?`): `boolean`
:::

Determine if the weight is exceeded for a given data sets given the amount of weight it cannot exceed.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dataSets` | `any`[][] | `undefined` |
| `amount?` | `number` | `255` |

#### Returns

`boolean`

#### Defined in

[server/systems/inventory/weight.ts:51](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/weight.ts#L51)

___

### override

::: tip Usage
Athena.systems.inventory.weight.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item weight functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getDataWeight"`` |
| `callback` | (`data`: `any`[]) => `number` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/weight.ts:93](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/weight.ts#L93)

::: tip Usage
Athena.systems.inventory.weight.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item weight functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getTotalWeight"`` |
| `callback` | (`dataSets`: `any`[][]) => `number` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/weight.ts:94](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/weight.ts#L94)

::: tip Usage
Athena.systems.inventory.weight.**override**(`functionName`, `callback`): `any`
:::

Used to override inventory item weight functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isWeightExceeded"`` |
| `callback` | (`dataSets`: `any`[][], `amount?`: `number`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/systems/inventory/weight.ts:95](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/weight.ts#L95)

___

### update

::: tip Usage
Athena.systems.inventory.weight.**update**<`T`\>(`dataSet`): [`player`](server_config.md#player)<`T`\>[]
:::

Update weight for a given data set, and all items.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | {} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataSet` | `StoredItem`<`T`\>[] |

#### Returns

[`player`](server_config.md#player)<`T`\>[]

#### Defined in

[server/systems/inventory/weight.ts:72](https://github.com/Stuyk/altv-athena/blob/27a8c87/src/core/server/systems/inventory/weight.ts#L72)
