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

[server/vehicle/tuning.ts:139](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L139)

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

[server/vehicle/tuning.ts:17](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L17)

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

[server/vehicle/tuning.ts:74](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L74)

___

### getExtras

::: tip Usage
Athena.vehicle.tuning.**getExtras**(`vehicle`): [`player`](server_config.md#player)[]
:::

Get all mods of the specified vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

[`player`](server_config.md#player)[]

#### Defined in

[server/vehicle/tuning.ts:34](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L34)

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

[server/vehicle/tuning.ts:176](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L176)

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

[server/vehicle/tuning.ts:107](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L107)

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

[server/vehicle/tuning.ts:207](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L207)

::: tip Usage
Athena.vehicle.tuning.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle tuning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setExtra"`` |
| `callback` | (`vehicle`: `Vehicle`, `extras`: `VehicleExtra`[]) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:208](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L208)

::: tip Usage
Athena.vehicle.tuning.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle tuning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"getExtras"`` |
| `callback` | (`vehicle`: `Vehicle`) => [`player`](server_config.md#player)[] |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:209](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L209)

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

[server/vehicle/tuning.ts:210](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L210)

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

[server/vehicle/tuning.ts:211](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L211)

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

[server/vehicle/tuning.ts:212](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L212)

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

[server/vehicle/tuning.ts:213](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L213)

___

### setExtra

::: tip Usage
Athena.vehicle.tuning.**setExtra**(`vehicle`, `extras`): `any`
:::

Applies specified properties to a vehicle in bulk.
These match the alt:V API, and can be pulled from a database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `extras` | `VehicleExtra`[] |  |

#### Returns

`any`

#### Defined in

[server/vehicle/tuning.ts:57](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/vehicle/tuning.ts#L57)