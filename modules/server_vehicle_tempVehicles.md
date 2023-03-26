---
title: Athena.vehicle.tempVehicles
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### add

▸ **add**(`vehicle`, `options`): `any`

Register a vehicle as temporary

**`Export`**

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

[server/vehicle/tempVehicles.ts:14](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L14)

___

### has

▸ **has**(`vehicle`): `boolean`

Check if a vehicle is temporary by id, or vehicle instance.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `any` |

#### Returns

`boolean`

#### Defined in

[server/vehicle/tempVehicles.ts:60](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L60)

___

### isOwner

▸ **isOwner**(`player`, `vehicle`): `boolean`

Check if player is owner of a temporary vehicle.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` |  |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/tempVehicles.ts:77](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L77)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override temporary vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"add"`` |
| `callback` | (`vehicle`: `Vehicle`, `options`: { `deleteOnLeave?`: `boolean` ; `owner?`: `number`  }) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:114](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L114)

▸ **override**(`functionName`, `callback`): `any`

Used to override temporary vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"remove"`` |
| `callback` | (`id`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:115](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L115)

▸ **override**(`functionName`, `callback`): `any`

Used to override temporary vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"has"`` |
| `callback` | (`vehicle`: `any`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:116](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L116)

▸ **override**(`functionName`, `callback`): `any`

Used to override temporary vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isOwner"`` |
| `callback` | (`player`: `Player`, `vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:117](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L117)

▸ **override**(`functionName`, `callback`): `any`

Used to override temporary vehicle functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"shouldBeDestroyed"`` |
| `callback` | (`vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/tempVehicles.ts:118](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L118)

___

### remove

▸ **remove**(`id`): `void`

Removes a temporary vehicle from the tracker.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`void`

#### Defined in

[server/vehicle/tempVehicles.ts:36](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L36)

___

### shouldBeDestroyed

▸ **shouldBeDestroyed**(`vehicle`): `boolean`

Check if this vehicle should be removed when a player leaves the drivers seat.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/tempVehicles.ts:96](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/vehicle/tempVehicles.ts#L96)
