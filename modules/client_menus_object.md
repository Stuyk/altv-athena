---
title: AthenaClient.menus.object
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Type Aliases

### ObjectMenuInjection

Ƭ **ObjectMenuInjection**: (`existingObject`: [`player`](server_config.md#player), `options`: [`IWheelOptionExt`](../interfaces/shared_interfaces_wheelMenu_IWheelOptionExt.md)[]) => [`IWheelOptionExt`](../interfaces/shared_interfaces_wheelMenu_IWheelOptionExt.md)[]

#### Type declaration

::: tip Usage
AthenaClient.menus.object.(`existingObject`, `options`): [`IWheelOptionExt`](../interfaces/shared_interfaces_wheelMenu_IWheelOptionExt.md)[]
:::

##### Parameters

| Name | Type |
| :------ | :------ |
| `existingObject` | [`player`](server_config.md#player) |
| `options` | [`IWheelOptionExt`](../interfaces/shared_interfaces_wheelMenu_IWheelOptionExt.md)[] |

##### Returns

[`IWheelOptionExt`](../interfaces/shared_interfaces_wheelMenu_IWheelOptionExt.md)[]

#### Defined in

[client/menus/object.ts:8](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/client/menus/object.ts#L8)

## Functions

### addInjection

::: tip Usage
AthenaClient.menus.object.**addInjection**(`callback`): `void`
:::

Allows the current Menu Options to be modified.
Meaning, a callback that will modify existing options, or append new options to the menu.
Must always return the original wheel menu options + your changes.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`ObjectMenuInjection`](client_menus_object.md#ObjectMenuInjection) |

#### Returns

`void`

#### Defined in

[client/menus/object.ts:25](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/client/menus/object.ts#L25)

___

### disable

::: tip Usage
AthenaClient.menus.object.**disable**(): `void`
:::

Disable the Object Wheel Menu

**`Export`**

#### Returns

`void`

#### Defined in

[client/menus/object.ts:98](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/client/menus/object.ts#L98)

___

### open

::: tip Usage
AthenaClient.menus.object.**open**(`object`): `void`
:::

Opens the wheel menu against a target object created with the server-side object api

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `CreatedObject` |

#### Returns

`void`

#### Defined in

[client/menus/object.ts:45](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/client/menus/object.ts#L45)

___

### override

::: tip Usage
AthenaClient.menus.object.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addInjection"`` |
| `callback` | (`callback`: [`ObjectMenuInjection`](client_menus_object.md#ObjectMenuInjection)) => `void` |

#### Returns

`any`

#### Defined in

[client/menus/object.ts:109](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/client/menus/object.ts#L109)

::: tip Usage
AthenaClient.menus.object.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"open"`` |
| `callback` | (`object`: `CreatedObject`) => `void` |

#### Returns

`any`

#### Defined in

[client/menus/object.ts:110](https://github.com/Stuyk/altv-athena/blob/3dfaad7/src/core/client/menus/object.ts#L110)
