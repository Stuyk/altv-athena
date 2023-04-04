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

[client/menus/object.ts:8](https://github.com/Stuyk/altv-athena/blob/36098eb/src/core/client/menus/object.ts#L8)

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

[client/menus/object.ts:24](https://github.com/Stuyk/altv-athena/blob/36098eb/src/core/client/menus/object.ts#L24)

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

[client/menus/object.ts:36](https://github.com/Stuyk/altv-athena/blob/36098eb/src/core/client/menus/object.ts#L36)
