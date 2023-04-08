---
title: AthenaShared.interfaces.wheelMenu.IWheelOptionExt
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/wheelMenu](../modules/shared_interfaces_wheelMenu.md).IWheelOptionExt

Used to describe a wheel menu option.

**`Interface`**

IWheelOption

## Hierarchy

- [`IWheelOption`](shared_interfaces_wheelMenu_IWheelOption.md)

  ↳ **`IWheelOptionExt`**

## Properties

### bgImage

• `Optional` **bgImage**: `string`

Image based on asset path.
Example: '/assets/icons/bullpuprifle.png'

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[bgImage](shared_interfaces_wheelMenu_IWheelOption.md#bgImage)

#### Defined in

[shared/interfaces/wheelMenu.ts:93](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L93)

___

### callback

• `Optional` **callback**: (...`args`: `any`[]) => `void`

#### Type declaration

::: tip Usage
AthenaShared.interfaces.wheelMenu.IWheelOptionExt.(`...args`): `void`
:::

A callback that will only work on client-side.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

[shared/interfaces/wheelMenu.ts:102](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L102)

___

### color

• `Optional` **color**: `string`

A plain text color for the icon and text color.

ie. `red`, `green`, `yellow`, etc.

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[color](shared_interfaces_wheelMenu_IWheelOption.md#color)

#### Defined in

[shared/interfaces/wheelMenu.ts:33](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L33)

___

### data

• `Optional` **data**: `any`[]

Any data that you want to pass through a callback or an event.

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[data](shared_interfaces_wheelMenu_IWheelOption.md#data)

#### Defined in

[shared/interfaces/wheelMenu.ts:75](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L75)

___

### doNotClose

• `Optional` **doNotClose**: `boolean`

Do not close the wheel menu after executing this option.

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[doNotClose](shared_interfaces_wheelMenu_IWheelOption.md#doNotClose)

#### Defined in

[shared/interfaces/wheelMenu.ts:51](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L51)

___

### emitClient

• `Optional` **emitClient**: `string`

From the client, emit a client event through alt.emit

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[emitClient](shared_interfaces_wheelMenu_IWheelOption.md#emitClient)

#### Defined in

[shared/interfaces/wheelMenu.ts:67](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L67)

___

### emitServer

• `Optional` **emitServer**: `string`

From the client, call a specific server event through alt.emitServer

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[emitServer](shared_interfaces_wheelMenu_IWheelOption.md#emitServer)

#### Defined in

[shared/interfaces/wheelMenu.ts:59](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L59)

___

### icon

• `Optional` **icon**: `string`

An icon from the `icons` page in the pages.

ie. `icon-home`

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[icon](shared_interfaces_wheelMenu_IWheelOption.md#icon)

#### Defined in

[shared/interfaces/wheelMenu.ts:43](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L43)

___

### image

• `Optional` **image**: `string`

Image based on asset path.
Example: '/assets/icons/bullpuprifle.png'

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[image](shared_interfaces_wheelMenu_IWheelOption.md#image)

#### Defined in

[shared/interfaces/wheelMenu.ts:84](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L84)

___

### name

• **name**: `string`

The name of this option.

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[name](shared_interfaces_wheelMenu_IWheelOption.md#name)

#### Defined in

[shared/interfaces/wheelMenu.ts:14](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L14)

___

### uid

• `Optional` **uid**: `string`

A unique identifier for this option.

If not specified one will automatically be created.

#### Inherited from

[IWheelOption](shared_interfaces_wheelMenu_IWheelOption.md).[uid](shared_interfaces_wheelMenu_IWheelOption.md#uid)

#### Defined in

[shared/interfaces/wheelMenu.ts:23](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/wheelMenu.ts#L23)
