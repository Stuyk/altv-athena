---
title: AthenaShared.interfaces.wheelMenu.IWheelOption
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/wheelMenu](../modules/shared_interfaces_wheelMenu.md).IWheelOption

Used to describe a wheel menu option.

**`Interface`**

IWheelOption

## Hierarchy

- **`IWheelOption`**

  ↳ [`IWheelOptionExt`](shared_interfaces_wheelMenu_IWheelOptionExt.md)

## Properties

### bgImage

• `Optional` **bgImage**: `string`

Image based on asset path.
Example: '/assets/icons/bullpuprifle.png'

#### Defined in

[shared/interfaces/wheelMenu.ts:93](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L93)

___

### color

• `Optional` **color**: `string`

A plain text color for the icon and text color.

ie. `red`, `green`, `yellow`, etc.

#### Defined in

[shared/interfaces/wheelMenu.ts:33](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L33)

___

### data

• `Optional` **data**: `any`[]

Any data that you want to pass through a callback or an event.

#### Defined in

[shared/interfaces/wheelMenu.ts:75](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L75)

___

### doNotClose

• `Optional` **doNotClose**: `boolean`

Do not close the wheel menu after executing this option.

#### Defined in

[shared/interfaces/wheelMenu.ts:51](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L51)

___

### emitClient

• `Optional` **emitClient**: `string`

From the client, emit a client event through alt.emit

#### Defined in

[shared/interfaces/wheelMenu.ts:67](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L67)

___

### emitServer

• `Optional` **emitServer**: `string`

From the client, call a specific server event through alt.emitServer

#### Defined in

[shared/interfaces/wheelMenu.ts:59](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L59)

___

### icon

• `Optional` **icon**: `string`

An icon from the `icons` page in the pages.

ie. `icon-home`

#### Defined in

[shared/interfaces/wheelMenu.ts:43](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L43)

___

### image

• `Optional` **image**: `string`

Image based on asset path.
Example: '/assets/icons/bullpuprifle.png'

#### Defined in

[shared/interfaces/wheelMenu.ts:84](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L84)

___

### name

• **name**: `string`

The name of this option.

#### Defined in

[shared/interfaces/wheelMenu.ts:14](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L14)

___

### uid

• `Optional` **uid**: `string`

A unique identifier for this option.

If not specified one will automatically be created.

#### Defined in

[shared/interfaces/wheelMenu.ts:23](https://github.com/Stuyk/altv-athena/blob/e4e897f/src/core/shared/interfaces/wheelMenu.ts#L23)
