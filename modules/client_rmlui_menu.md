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

[client/rmlui/menu/index.ts:477](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/rmlui/menu/index.ts#L477)

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

[client/rmlui/menu/index.ts:446](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/rmlui/menu/index.ts#L446)

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

[client/rmlui/menu/index.ts:503](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/rmlui/menu/index.ts#L503)

___

### pauseControls

::: tip Usage
AthenaClient.rmlui.menu.**pauseControls**(): `void`
:::

#### Returns

`void`

#### Defined in

[client/rmlui/menu/index.ts:482](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/rmlui/menu/index.ts#L482)

___

### replaceOptions

::: tip Usage
AthenaClient.rmlui.menu.**replaceOptions**(`options`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`MenuOptions`](client_rmlui_menu_menuInterfaces.md#MenuOptions) |

#### Returns

`void`

#### Defined in

[client/rmlui/menu/index.ts:490](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/rmlui/menu/index.ts#L490)

___

### unpauseControls

::: tip Usage
AthenaClient.rmlui.menu.**unpauseControls**(): `void`
:::

#### Returns

`void`

#### Defined in

[client/rmlui/menu/index.ts:486](https://github.com/Stuyk/altv-athena/blob/d9b1cbb/src/core/client/rmlui/menu/index.ts#L486)
