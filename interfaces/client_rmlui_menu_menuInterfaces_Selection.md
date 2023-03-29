---
title: AthenaClient.rmlui.menu.menuInterfaces.Selection
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/rmlui/menu/menuInterfaces](../modules/client_rmlui_menu_menuInterfaces.md).Selection

## Hierarchy

- [`MenuOptionBase`](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md)<(`value`: `string`) => `void`\>

  ↳ **`Selection`**

## Properties

### callback

• **callback**: `Function` \| (`value`: `string`) => `void`

A callback when this menu option is changed.

#### Inherited from

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[callback](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#callback)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:26](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/client/rmlui/menu/menuInterfaces.ts#L26)

___

### description

• **description**: `string`

A description of this menu option.

#### Inherited from

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[description](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#description)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:18](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/client/rmlui/menu/menuInterfaces.ts#L18)

___

### onlyUpdateOnEnter

• `Optional` **onlyUpdateOnEnter**: `boolean`

Only update when 'Enter' is pressed.

#### Overrides

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[onlyUpdateOnEnter](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#onlyUpdateOnEnter)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:62](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/client/rmlui/menu/menuInterfaces.ts#L62)

___

### options

• **options**: `string`[]

The available values for this option.

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:46](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/client/rmlui/menu/menuInterfaces.ts#L46)

___

### title

• **title**: `string`

The title of this menu option.

#### Inherited from

[MenuOptionBase](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md).[title](client_rmlui_menu_menuInterfaces_Internal_MenuOptionBase.md#title)

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:10](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/client/rmlui/menu/menuInterfaces.ts#L10)

___

### type

• **type**: ``"Selection"``

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:38](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/client/rmlui/menu/menuInterfaces.ts#L38)

___

### value

• **value**: `number`

Current index of this selection.

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:54](https://github.com/Stuyk/altv-athena/blob/6375486/src/core/client/rmlui/menu/menuInterfaces.ts#L54)
