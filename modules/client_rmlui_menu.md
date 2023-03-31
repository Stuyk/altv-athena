---
title: AthenaClient.rmlui.menu
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### close

::: tip Usage
AthenaClient.rmlui.menu.**close**(): `Promise`<`void`\>
:::

Call this function to close the menu.
Make sure to wait for it to close before opening a new menu.

#### Returns

`Promise`<`void`\>

#### Defined in

[client/rmlui/menu/index.ts:373](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/client/rmlui/menu/index.ts#L373)

___

### create

::: tip Usage
AthenaClient.rmlui.menu.**create**(`info`): `void`
:::

Create a menu similar to NativeUI.

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`MenuInfo`](../interfaces/client_rmlui_menu_menuInterfaces_MenuInfo.md) |

#### Returns

`void`

#### Defined in

[client/rmlui/menu/index.ts:344](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/client/rmlui/menu/index.ts#L344)

___

### createOption

::: tip Usage
AthenaClient.rmlui.menu.**createOption**<`T`\>(`menuTemplate`): `T`
:::

Build a menu option, and return the result.
Used like: `createOption<Range>({ ... })`;

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`Selection`](../interfaces/client_rmlui_menu_menuInterfaces_Selection.md) \| [`Range`](../interfaces/client_rmlui_menu_menuInterfaces_Range.md) \| [`Toggle`](../interfaces/client_rmlui_menu_menuInterfaces_Toggle.md) \| [`Invoke`](../interfaces/client_rmlui_menu_menuInterfaces_Invoke.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `menuTemplate` | `T` |

#### Returns

`T`

#### Defined in

[client/rmlui/menu/index.ts:386](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/client/rmlui/menu/index.ts#L386)
