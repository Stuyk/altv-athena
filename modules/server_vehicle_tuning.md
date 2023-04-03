---
title: Athena.vehicle.tuning
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### applyState

::: tip Usage
Athena.vehicle.tuning.**applyState**(`vehicle`, `state`): `any`
:::

Applies specified properties to a vehicle in bulk.
These match the alt:V API, and can be pulled from a database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `state` | `any` | - |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:14](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/vehicle/tuning.ts#L14)

___

### applyTuning

::: tip Usage
Athena.vehicle.tuning.**applyTuning**(`vehicle`, `tuning`): `any`
:::

Apply tuning to the specified vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `tuning` | `any` |  |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:31](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/vehicle/tuning.ts#L31)

___

### getTuning

::: tip Usage
Athena.vehicle.tuning.**getTuning**(`vehicle`): [`player`](server_config.md#player)
:::

Get all mods of the specified vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

[`player`](server_config.md#player)

#### Defined in

[server/vehicle/tuning.ts:58](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/vehicle/tuning.ts#L58)

___

### override

::: tip Usage
Athena.vehicle.tuning.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle tuning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"applyState"`` |
| `callback` | (`vehicle`: `Vehicle`, `state`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:81](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/vehicle/tuning.ts#L81)

::: tip Usage
Athena.vehicle.tuning.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle tuning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"applyTuning"`` |
| `callback` | (`vehicle`: `Vehicle`, `tuning`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:82](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/vehicle/tuning.ts#L82)

::: tip Usage
Athena.vehicle.tuning.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle tuning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getTuning"`` |
| `callback` | (`vehicle`: `Vehicle`) => [`player`](server_config.md#player) |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:83](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/vehicle/tuning.ts#L83)
