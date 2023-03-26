---
title: AthenaClient.rmlui.menu
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### close

▸ **close**(): `Promise`<`void`\>

Call this function to close the menu.
Make sure to wait for it to close before opening a new menu.

#### Returns

`Promise`<`void`\>

#### Defined in

[client/rmlui/menu/index.ts:373](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/rmlui/menu/index.ts#L373)

___

### create

▸ **create**(`info`): `void`

Create a menu similar to NativeUI.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | [`MenuInfo`](../interfaces/client_rmlui_menu_menuInterfaces_MenuInfo.md) |

#### Returns

`void`

#### Defined in

[client/rmlui/menu/index.ts:344](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/rmlui/menu/index.ts#L344)

___

### createOption

▸ **createOption**<`T`\>(`menuTemplate`): `T`

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

[client/rmlui/menu/index.ts:386](https://github.com/Stuyk/altv-athena/blob/2ba937d/src/core/client/rmlui/menu/index.ts#L386)
