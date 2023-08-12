---
title: Athena.vehicle.add
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [AddOptions](../interfaces/server_vehicle_add_AddOptions.md)

## Functions

### override

::: tip Usage
Athena.vehicle.add.**override**(`functionName`, `callback`): `any`
:::

Used to override add owned vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toDatabase"`` |
| `callback` | (`owner`: `string`, `model`: `string`, `pos`: `IVector3`, `options`: [`AddOptions`](../interfaces/server_vehicle_add_AddOptions.md)) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/add.ts:197](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/server/vehicle/add.ts#L197)

::: tip Usage
Athena.vehicle.add.**override**(`functionName`, `callback`): `any`
:::

Used to override add owned vehicle functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toPlayer"`` |
| `callback` | (`player`: `Player`, `model`: `string`, `pos`: `IVector3`, `options`: [`Omit`](server_player_inventory_Internal.md#Omit)<[`AddOptions`](../interfaces/server_vehicle_add_AddOptions.md), ``"doNotDespawn"``\>) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/add.ts:198](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/server/vehicle/add.ts#L198)

___

### toDatabase

::: tip Usage
Athena.vehicle.add.**toDatabase**(`owner`, `model`, `pos`, `options?`): `Promise`<`boolean`\>
:::

Add a vehicle to the database.

Owner can be an identifier, group, etc.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `owner` | `string` | `undefined` | - |
| `model` | `string` | `undefined` |  |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `options` | [`AddOptions`](../interfaces/server_vehicle_add_AddOptions.md) | `undefined` | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/add.ts:135](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/server/vehicle/add.ts#L135)

___

### toPlayer

::: tip Usage
Athena.vehicle.add.**toPlayer**(`player`, `model`, `pos`, `options?`): `Promise`<`boolean`\>
:::

Add a vehicle to a player.
The position specified is where the vehicle can be found.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `model` | `string` | `undefined` |  |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `options` | [`Omit`](server_player_inventory_Internal.md#Omit)<[`AddOptions`](../interfaces/server_vehicle_add_AddOptions.md), ``"doNotDespawn"``\> | `undefined` | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/vehicle/add.ts:64](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/server/vehicle/add.ts#L64)
