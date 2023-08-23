---
title: AthenaClient.rmlui.menu.menuInterfaces.MenuInfo
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/rmlui/menu/menuInterfaces](../modules/client_rmlui_menu_menuInterfaces.md).MenuInfo

## Properties

### callbackOnClose

• `Optional` **callbackOnClose**: `Function`

Function to call when the menu is closed through other means.

**`Memberof`**

MenuInfo

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:168](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/rmlui/menu/menuInterfaces.ts#L168)

___

### header

• **header**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `any` | The banner background color of this menu. |
| `title` | `string` | The title of this menu. |

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:138](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/rmlui/menu/menuInterfaces.ts#L138)

___

### options

• **options**: ([`Selection`](client_rmlui_menu_menuInterfaces_Selection.md) \| [`Range`](client_rmlui_menu_menuInterfaces_Range.md) \| [`Toggle`](client_rmlui_menu_menuInterfaces_Toggle.md) \| [`Invoke`](client_rmlui_menu_menuInterfaces_Invoke.md) \| [`Input`](client_rmlui_menu_menuInterfaces_Input.md))[]

An array of available menu types to invoke.

#### Defined in

[client/rmlui/menu/menuInterfaces.ts:160](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/client/rmlui/menu/menuInterfaces.ts#L160)
