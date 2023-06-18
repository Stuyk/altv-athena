---
title: Athena.getters.vehicles
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### asOwnedVehicles

::: tip Usage
Athena.getters.vehicles.**asOwnedVehicles**<`T`\>(): `any`
:::

Get all owned vehicles.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `OwnedVehicle` |

#### Returns

`any`

#### Defined in

[server/getters/vehicles.ts:28](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/getters/vehicles.ts#L28)

___

### inRange

::: tip Usage
Athena.getters.vehicles.**inRange**(`pos`, `range`): `alt.Vehicle`[]
:::

Get all vehicles in range of a position

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |
| `range` | `number` |  |

#### Returns

`alt.Vehicle`[]

#### Defined in

[server/getters/vehicles.ts:12](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/server/getters/vehicles.ts#L12)
