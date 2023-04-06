---
title: Athena.vehicle.spawn
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### all

::: tip Usage
Athena.vehicle.spawn.**all**(): `any`
:::

Spawn all vehicles from the database.

#### Returns

`any`

#### Defined in

[server/vehicle/spawn.ts:107](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L107)

___

### override

::: tip Usage
Athena.vehicle.spawn.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle spawning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"all"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/spawn.ts:131](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L131)

::: tip Usage
Athena.vehicle.spawn.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle spawning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"temporary"`` |
| `callback` | (`vehicleInfo`: [`VehicleSpawnInfo`](../interfaces/server_vehicle_shared_VehicleSpawnInfo.md), `deleteOnLeave`: `boolean`) => `alt.Vehicle` |

#### Returns

`any`

#### Defined in

[server/vehicle/spawn.ts:132](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L132)

::: tip Usage
Athena.vehicle.spawn.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle spawning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"temporaryOwned"`` |
| `callback` | (`player`: `Player`, `vehicleInfo`: [`VehicleSpawnInfo`](../interfaces/server_vehicle_shared_VehicleSpawnInfo.md), `deleteOnLeave`: `boolean`) => `alt.Vehicle` |

#### Returns

`any`

#### Defined in

[server/vehicle/spawn.ts:133](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L133)

::: tip Usage
Athena.vehicle.spawn.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle spawning functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"persistent"`` |
| `callback` | (`document`: `OwnedVehicle`) => `alt.Vehicle` \| `undefined` |

#### Returns

`any`

#### Defined in

[server/vehicle/spawn.ts:134](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L134)

___

### persistent

::: tip Usage
Athena.vehicle.spawn.**persistent**(`document`): `alt.Vehicle` \| `undefined`
:::

Spawn a saved vehicle that belongs to a player.
Returns undefined if the vehicle is already spawned.

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `OwnedVehicle` |

#### Returns

`alt.Vehicle` \| `undefined`

#### Defined in

[server/vehicle/spawn.ts:67](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L67)

___

### temporary

::: tip Usage
Athena.vehicle.spawn.**temporary**(`vehicleInfo`, `deleteOnLeave?`): `alt.Vehicle`
:::

Spawn a temporary vehicle; it cannot be saved.
It is not owned by anyone.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `vehicleInfo` | [`VehicleSpawnInfo`](../interfaces/server_vehicle_shared_VehicleSpawnInfo.md) | `undefined` |
| `deleteOnLeave` | `boolean` | `false` |

#### Returns

`alt.Vehicle`

#### Defined in

[server/vehicle/spawn.ts:15](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L15)

___

### temporaryOwned

::: tip Usage
Athena.vehicle.spawn.**temporaryOwned**(`player`, `vehicleInfo`, `deleteOnLeave?`): `alt.Vehicle`
:::

Spawn a temporary vehicle; owned by the player.
Cannot be modified by the player.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `vehicleInfo` | [`VehicleSpawnInfo`](../interfaces/server_vehicle_shared_VehicleSpawnInfo.md) | `undefined` |  |
| `deleteOnLeave` | `boolean` | `false` |  |

#### Returns

`alt.Vehicle`

#### Defined in

[server/vehicle/spawn.ts:42](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/server/vehicle/spawn.ts#L42)
