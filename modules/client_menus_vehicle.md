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

::: tip Usage
AthenaClient.menus.vehicle.(`target`, `options`): [`player`](server_config.md#player)[]
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `alt.Vehicle` |
| `options` | [`player`](server_config.md#player)[] |

##### Returns

[`player`](server_config.md#player)[]

#### Defined in

[client/menus/vehicle.ts:8](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L8)

## Functions

### addInjection

::: tip Usage
AthenaClient.menus.vehicle.**addInjection**(`callback`): `any`
:::

Create a vehicle wheel menu injection.
Meaning, a callback that will modify existing options, or append new options to the menu.
Must always return the original wheel menu options + your changes.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`VehicleMenuInjection`](client_menus_vehicle.md#VehicleMenuInjection) |

#### Returns

`any`

#### Defined in

[client/menus/vehicle.ts:22](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L22)

___

### disable

::: tip Usage
AthenaClient.menus.vehicle.**disable**(): `void`
:::

Disable the Vehicle Wheel Menu

**`Export`**

#### Returns

`void`

#### Defined in

[client/menus/vehicle.ts:157](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L157)

___

### open

::: tip Usage
AthenaClient.menus.vehicle.**open**(`vehicle`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `vehicle` | `Vehicle` |

#### Returns

`any`

#### Defined in

[client/menus/vehicle.ts:87](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L87)

___

### openInVehicleMenu

::: tip Usage
AthenaClient.menus.vehicle.**openInVehicleMenu**(`vehicle`): `any`
:::

Open an in-vehicle menu option and add injections relevant to in-vehicle.

**`Static`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`any`

#### Defined in

[client/menus/vehicle.ts:38](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L38)

___

### override

::: tip Usage
AthenaClient.menus.vehicle.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addInjection"`` |
| `callback` | (`callback`: [`VehicleMenuInjection`](client_menus_vehicle.md#VehicleMenuInjection)) => `any` |

#### Returns

`any`

#### Defined in

[client/menus/vehicle.ts:169](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L169)

::: tip Usage
AthenaClient.menus.vehicle.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"open"`` |
| `callback` | (`vehicle`: `Vehicle`) => `any` |

#### Returns

`any`

#### Defined in

[client/menus/vehicle.ts:170](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L170)

::: tip Usage
AthenaClient.menus.vehicle.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"openInVehicleMenu"`` |
| `callback` | (`vehicle`: `Vehicle`) => `any` |

#### Returns

`any`

#### Defined in

[client/menus/vehicle.ts:171](https://github.com/Stuyk/altv-athena/blob/4945ccd/src/core/client/menus/vehicle.ts#L171)
