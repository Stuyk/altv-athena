---
title: Athena.vehicle.tuning
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### applyMods

::: tip Usage
Athena.vehicle.tuning.**applyMods**(`vehicle`, `modkit`, `mods`): `any`
:::

Apply mods to a vehicle.

Automatically saves data if vehicle is non-temporary.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |
| `modkit` | `number` |
| `mods` | `IVehicleMod`[] |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:86](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L86)

___

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

[server/vehicle/tuning.ts:16](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L16)

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

[server/vehicle/tuning.ts:33](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L33)

___

### getMods

::: tip Usage
Athena.vehicle.tuning.**getMods**(`vehicle`): [`player`](server_config.md#player)[]
:::

Return all mods that are currently applied to a vehicle.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/vehicle/tuning.ts:123](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L123)

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

[server/vehicle/tuning.ts:60](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L60)

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

[server/vehicle/tuning.ts:146](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L146)

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

[server/vehicle/tuning.ts:147](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L147)

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

[server/vehicle/tuning.ts:148](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L148)

::: tip Usage
Athena.vehicle.tuning.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle tuning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"applyMods"`` |
| `callback` | (`vehicle`: `Vehicle`, `modkit`: `number`, `mods`: `IVehicleMod`[]) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:149](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L149)

::: tip Usage
Athena.vehicle.tuning.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle tuning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getMods"`` |
| `callback` | (`vehicle`: `Vehicle`) => [`player`](server_config.md#player)[] |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:150](https://github.com/Stuyk/altv-athena/blob/f9f448a/src/core/server/vehicle/tuning.ts#L150)
