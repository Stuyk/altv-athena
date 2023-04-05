---
title: AthenaClient.rmlui.menu3d
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### close

::: tip Usage
AthenaClient.rmlui.menu3d.**close**(): `Promise`<`void`\>
:::

Call this function to close the menu.
Make sure to wait for it to close before opening a new menu.

#### Returns

`Promise`<`void`\>

#### Defined in

[client/rmlui/menu3d/index.ts:192](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/rmlui/menu3d/index.ts#L192)

___

### create

::: tip Usage
AthenaClient.rmlui.menu3d.**create**(`pos`, `options`, `maxDistance?`): `void`
:::

Create an in-world 3D menu with maximum options.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `options` | [`OptionFor3DMenu`](../interfaces/client_rmlui_menu3d_menu3DInterfaces_OptionFor3DMenu.md)[] | `undefined` |  |
| `maxDistance` | `number` | `8` |  |

#### Returns

`void`

#### Defined in

[client/rmlui/menu3d/index.ts:166](https://github.com/Stuyk/altv-athena/blob/8f61820/src/core/client/rmlui/menu3d/index.ts#L166)
