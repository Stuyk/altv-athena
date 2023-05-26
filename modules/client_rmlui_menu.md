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

[client/rmlui/menu/index.ts:435](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/rmlui/menu/index.ts#L435)

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

[client/rmlui/menu/index.ts:405](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/rmlui/menu/index.ts#L405)

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

[client/rmlui/menu/index.ts:456](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/rmlui/menu/index.ts#L456)

___

### pauseControls

::: tip Usage
AthenaClient.rmlui.menu.**pauseControls**(): `void`
:::

#### Returns

`void`

#### Defined in

[client/rmlui/menu/index.ts:440](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/rmlui/menu/index.ts#L440)

___

### unpauseControls

::: tip Usage
AthenaClient.rmlui.menu.**unpauseControls**(): `void`
:::

#### Returns

`void`

#### Defined in

[client/rmlui/menu/index.ts:444](https://github.com/Stuyk/altv-athena/blob/8d130a5/src/core/client/rmlui/menu/index.ts#L444)
