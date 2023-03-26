---
title: Athena.vehicle.events
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### AthenaVehicleEvents

Ƭ **AthenaVehicleEvents**: ``"engine-started"`` \| ``"engine-stopped"`` \| ``"door-opened"`` \| ``"door-closed"`` \| ``"doors-locked"`` \| ``"doors-lock-changed"`` \| ``"doors-unlocked"`` \| ``"vehicle-destroyed"`` \| ``"vehicle-repaired"`` \| ``"vehicle-spawned"`` \| ``"vehicle-repaired"``

#### Defined in

[server/vehicle/events.ts:4](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L4)

## Functions

### on

▸ **on**(`eventName`, `callback`): `any`

Triggered when a vehicle has been spawned / created.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"vehicle-spawned"`` |
| `callback` | (`vehicle`: `Vehicle`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:45](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L45)

▸ **on**(`eventName`, `callback`): `any`

Triggered when a doors are unlocked by a player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"doors-unlocked"`` |
| `callback` | (`vehicle`: `Vehicle`, `player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:53](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L53)

▸ **on**(`eventName`, `callback`): `any`

Triggered when a doors are locked by a player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"doors-locked"`` |
| `callback` | (`vehicle`: `Vehicle`, `player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:61](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L61)

▸ **on**(`eventName`, `callback`): `any`

Triggered when a door locks are updated for any status.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"doors-lock-changed"`` |
| `callback` | (`vehicle`: `Vehicle`, `player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:69](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L69)

▸ **on**(`eventName`, `callback`): `any`

Triggered when a door is closed by a player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"door-closed"`` |
| `callback` | (`vehicle`: `Vehicle`, `door`: `number`, `player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:77](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L77)

▸ **on**(`eventName`, `callback`): `any`

Triggered when a door is opened by a player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"door-opened"`` |
| `callback` | (`vehicle`: `Vehicle`, `door`: `number`, `player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:88](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L88)

▸ **on**(`eventName`, `callback`): `any`

Triggered when the engine is stopped by a player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"engine-stopped"`` |
| `callback` | (`vehicle`: `Vehicle`, `player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:99](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L99)

▸ **on**(`eventName`, `callback`): `any`

Triggered when the engine is started by a player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"engine-started"`` |
| `callback` | (`vehicle`: `Vehicle`, `player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:107](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L107)

▸ **on**(`eventName`, `callback`): `any`

Triggered when the internal repair function is called.

Does not work for vehicle.repair();

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"vehicle-repaired"`` |
| `callback` | (`vehicle`: `Vehicle`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:117](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L117)

▸ **on**(`eventName`, `callback`): `any`

Triggered when a vehicle is destroyed, and despawned.

This event is only fired by a default system.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | ``"vehicle-destroyed"`` |
| `callback` | (`vehicle`: `Vehicle`, `document`: `any`) => `void` |

#### Returns

`any`

#### Defined in

[server/vehicle/events.ts:127](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L127)

___

### trigger

▸ **trigger**<`CustomEvents`\>(`eventName`, `vehicle`, `...args`): `void`

Usually called by internal functions. Can be used to manually trigger an Athena Event though.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomEvents` | [`AthenaVehicleEvents`](server_vehicle_events.md#AthenaVehicleEvents) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `CustomEvents` |  |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `...args` | `any`[] | - |

#### Returns

`void`

#### Defined in

[server/vehicle/events.ts:25](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/vehicle/events.ts#L25)
