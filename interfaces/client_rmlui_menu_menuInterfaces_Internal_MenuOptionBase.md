---
title: AthenaClient.rmlui.menu.menuInterfaces.Internal.MenuOptionBase
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/rmlui/menu/menuInterfaces](../modules/client_rmlui_menu_menuInterfaces.md).[Internal](../modules/client_rmlui_menu_menuInterfaces_Internal.md).MenuOptionBase

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `Function` |

## Hierarchy

- **`MenuOptionBase`**

  ↳ [`Selection`](client_rmlui_menu_menuInterfaces_Selection.md)

  ↳ [`Toggle`](client_rmlui_menu_menuInterfaces_Toggle.md)

  ↳ [`Range`](client_rmlui_menu_menuInterfaces_Range.md)

  ↳ [`Input`](client_rmlui_menu_menuInterfaces_Input.md)

  ↳ [`Invoke`](client_rmlui_menu_menuInterfaces_Invoke.md)

## Properties

### callback

• **callback**: `Function` \| `T` \| (...`args`: `any`[]) => `void`

A callback when this menu option is changed.

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:26](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/rmlui/menu/menuInterfaces.ts#L26)

___

### description

• **description**: `string`

A description of this menu option.

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:18](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/rmlui/menu/menuInterfaces.ts#L18)

___

### onlyUpdateOnEnter

• `Optional` **onlyUpdateOnEnter**: `boolean`

Only for Range & Selection Types

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:34](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/rmlui/menu/menuInterfaces.ts#L34)

___

### title

• **title**: `string`

The title of this menu option.

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:10](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/rmlui/menu/menuInterfaces.ts#L10)
