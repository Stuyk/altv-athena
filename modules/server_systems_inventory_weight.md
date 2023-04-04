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

[server/systems/inventory/weight.ts:10](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/inventory/weight.ts#L10)

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

[server/systems/inventory/weight.ts:33](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/inventory/weight.ts#L33)

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

[server/systems/inventory/weight.ts:50](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/inventory/weight.ts#L50)

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

[server/systems/inventory/weight.ts:71](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/inventory/weight.ts#L71)

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

[server/systems/inventory/weight.ts:72](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/inventory/weight.ts#L72)

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

[server/systems/inventory/weight.ts:73](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/server/systems/inventory/weight.ts#L73)
