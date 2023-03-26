---
title: AthenaClient.menus.vehicle
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### VehicleMenuInjection

Ƭ **VehicleMenuInjection**: (`target`: `alt.Vehicle`, `options`: [`player`](server_config.md#player)[]) => [`player`](server_config.md#player)[]

#### Type declaration

▸ (`target`, `options`): [`player`](server_config.md#player)[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `alt.Vehicle` |
| `options` | [`player`](server_config.md#player)[] |

##### Returns

[`player`](server_config.md#player)[]

#### Defined in

[client/menus/vehicle.ts:8](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/menus/vehicle.ts#L8)

## Functions

### addInjection

▸ **addInjection**(`callback`): `void`

Create a vehicle wheel menu injection.
Meaning, a callback that will modify existing options, or append new options to the menu.
Must always return the original wheel menu options + your changes.

**`Static`**

**`Memberof`**

VehicleMenu

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`VehicleMenuInjection`](client_menus_vehicle.md#VehicleMenuInjection) |

#### Returns

`void`

#### Defined in

[client/menus/vehicle.ts:21](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/menus/vehicle.ts#L21)

___

### open

▸ **open**(`vehicle`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |

#### Returns

`void`

#### Defined in

[client/menus/vehicle.ts:74](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/menus/vehicle.ts#L74)

___

### openInVehicleMenu

▸ **openInVehicleMenu**(`vehicle`): `void`

Open an in-vehicle menu option and add injections relevant to in-vehicle.

**`Static`**

**`Memberof`**

VehicleWheelMenu

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`void`

#### Defined in

[client/menus/vehicle.ts:33](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/menus/vehicle.ts#L33)
