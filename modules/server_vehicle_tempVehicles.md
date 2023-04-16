---
title: Athena.vehicle.tempVehicles
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### add

::: tip Usage
Athena.vehicle.tempVehicles.**add**(`vehicle`, `options`): `any`
:::

Register a vehicle as temporary

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `options` | `Object` |  |
| `options.deleteOnLeave?` | `boolean` | - |
| `options.owner?` | `number` | - |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:14](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L14)

___

### has

::: tip Usage
Athena.vehicle.tempVehicles.**has**(`vehicle`): `boolean`
:::

Check if a vehicle is temporary by id, or vehicle instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `any` |

#### Returns

`boolean`

#### Defined in

[server/vehicle/tempVehicles.ts:60](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L60)

___

### isOwner

::: tip Usage
Athena.vehicle.tempVehicles.**isOwner**(`player`, `vehicle`): `boolean`
:::

Check if player is owner of a temporary vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` |  |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/tempVehicles.ts:77](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L77)

___

### override

::: tip Usage
Athena.vehicle.tempVehicles.**override**(`functionName`, `callback`): `any`
:::

Used to override temporary vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | (`vehicle`: `Vehicle`, `options`: { `deleteOnLeave?`: `boolean` ; `owner?`: `number`  }) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:114](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L114)

::: tip Usage
Athena.vehicle.tempVehicles.**override**(`functionName`, `callback`): `any`
:::

Used to override temporary vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`id`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:115](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L115)

::: tip Usage
Athena.vehicle.tempVehicles.**override**(`functionName`, `callback`): `any`
:::

Used to override temporary vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"has"`` |
| `callback` | (`vehicle`: `any`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:116](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L116)

::: tip Usage
Athena.vehicle.tempVehicles.**override**(`functionName`, `callback`): `any`
:::

Used to override temporary vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isOwner"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:117](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L117)

::: tip Usage
Athena.vehicle.tempVehicles.**override**(`functionName`, `callback`): `any`
:::

Used to override temporary vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"shouldBeDestroyed"`` |
| `callback` | (`vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:118](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L118)

___

### remove

::: tip Usage
Athena.vehicle.tempVehicles.**remove**(`id`): `void`
:::

Removes a temporary vehicle from the tracker.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`void`

#### Defined in

[server/vehicle/tempVehicles.ts:36](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L36)

___

### shouldBeDestroyed

::: tip Usage
Athena.vehicle.tempVehicles.**shouldBeDestroyed**(`vehicle`): `boolean`
:::

Check if this vehicle should be removed when a player leaves the drivers seat.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/tempVehicles.ts:96](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/server/vehicle/tempVehicles.ts#L96)
