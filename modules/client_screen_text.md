---
title: AthenaClient.screen.text
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### addTemporaryText

::: Tip
AthenaClient.screen.text.**addTemporaryText**(`identifier`, `msg`, `x`, `y`, `scale`, `r`, `g`, `b`, `a`, `ms`): `void`
:::

Adds text temporarily on the screen.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `identifier` | `any` |
| `msg` | `any` |
| `x` | `any` |
| `y` | `any` |
| `scale` | `any` |
| `r` | `any` |
| `g` | `any` |
| `b` | `any` |
| `a` | `any` |
| `ms` | `any` |

#### Returns

`void`

#### Defined in

[client/screen/text.ts:116](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/screen/text.ts#L116)

___

### drawRectangle

::: Tip
AthenaClient.screen.text.**drawRectangle**(`pos`, `size`, `color`): `void`
:::

Draw a box at a 3D coordinate

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |
| `size` | `IVector2` |  |
| `color` | `RGBA` |  |

#### Returns

`void`

#### Defined in

[client/screen/text.ts:52](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/screen/text.ts#L52)

___

### drawRectangle2D

::: Tip
AthenaClient.screen.text.**drawRectangle2D**(`pos`, `size`, `color`): `void`
:::

Draw a box on-screen

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `pos` | `IVector2` |
| `size` | `IVector2` |
| `color` | `RGBA` |

#### Returns

`void`

#### Defined in

[client/screen/text.ts:71](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/screen/text.ts#L71)

___

### drawText2D

::: Tip
AthenaClient.screen.text.**drawText2D**(`text`, `pos`, `scale`, `color`, `alignment?`, `padding?`): `void`
:::

Draw text on your screen in a 2D position with an every tick.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `text` | `string` | `undefined` |  |
| `pos` | `IVector2` | `undefined` |  |
| `scale` | `number` | `undefined` |  |
| `color` | `RGBA` | `undefined` |  |
| `alignment` | `number` | `0` | 0 Center, 1 Left, 2 Right |
| `padding` | `number` | `0` | - |

#### Returns

`void`

#### Defined in

[client/screen/text.ts:15](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/screen/text.ts#L15)

___

### drawText3D

::: Tip
AthenaClient.screen.text.**drawText3D**(`text`, `pos`, `scale`, `color`): `void`
:::

Draw stable text in a 3D position with an every tick.

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `pos` | `IVector3` |
| `scale` | `number` |
| `color` | `RGBA` |

#### Returns

`void`

#### Defined in

[client/screen/text.ts:83](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/client/screen/text.ts#L83)
