---
title: AthenaClient.rmlui.menu.menuInterfaces.Range
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/rmlui/menu/menuInterfaces](../modules/client_rmlui_menu_menuInterfaces.md).Range

## Hierarchy

- [`MenuOptionBase`](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md)<(`value`: `number`) => `void`\>

  ↳ **`Range`**

## Properties

### callback

• **callback**: `Function` \| (...`args`: `any`[]) => `void` \| (`value`: `number`) => `void`

A callback when this menu option is changed.

#### Inherited from

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[callback](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#callback)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:26](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L26)

___

### description

• **description**: `string`

A description of this menu option.

#### Inherited from

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[description](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#description)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:18](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L18)

___

### increment

• **increment**: `number`

Number to increment by

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:110](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L110)

___

### max

• **max**: `number`

Maximum Value

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:102](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L102)

___

### min

• **min**: `number`

Minimum Value

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:94](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L94)

___

### onlyUpdateOnEnter

• `Optional` **onlyUpdateOnEnter**: `boolean`

Only update when 'Enter' is pressed.

#### Overrides

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[onlyUpdateOnEnter](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#onlyUpdateOnEnter)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:118](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L118)

___

### title

• **title**: `string`

The title of this menu option.

#### Inherited from

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[title](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#title)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:10](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L10)

___

### type

• **type**: ``"Range"``

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:78](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L78)

___

### value

• **value**: `number`

The starting value of the range.

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:86](https://github.com/Stuyk/altv-athena/blob/6c506bf/src/core/client/rmlui/menu/menuInterfaces.ts#L86)
