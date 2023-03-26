---
title: Athena.vehicle.tuning
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### applyState

▸ **applyState**(`vehicle`, `state`): `any`

Applies specified properties to a vehicle in bulk.
These match the alt:V API, and can be pulled from a database.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `state` | `any` | - |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:14](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/tuning.ts#L14)

___

### applyTuning

▸ **applyTuning**(`vehicle`, `tuning`): `any`

Apply tuning to the specified vehicle.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `tuning` | `any` |  |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:31](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/tuning.ts#L31)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override vehicle tuning functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"applyState"`` |
| `callback` | (`vehicle`: `Vehicle`, `state`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:58](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/tuning.ts#L58)

▸ **override**(`functionName`, `callback`): `any`

Used to override vehicle tuning functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"applyTuning"`` |
| `callback` | (`vehicle`: `Vehicle`, `tuning`: `any`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:59](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/tuning.ts#L59)
