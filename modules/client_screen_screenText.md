---
title: AthenaClient.screen.screenText
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [TextProperties](../interfaces/client_screen_screenText_TextProperties.md)

## Functions

### addLongString

::: tip Usage
AthenaClient.screen.screenText.**addLongString**(`text`): `void`
:::

Used as a utility for string length.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`void`

#### Defined in

[client/screen/screenText.ts:22](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/client/screen/screenText.ts#L22)

___

### drawTextWithBackground

::: tip Usage
AthenaClient.screen.screenText.**drawTextWithBackground**(`text`, `x`, `y`, `scale`, `font`, `background`, `foreground`, `props`): `void`
:::

Draw text with a background and apply padding.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `x` | `number` |
| `y` | `number` |
| `scale` | `number` |
| `font` | `number` |
| `background` | `RGBA` |
| `foreground` | `RGBA` |
| `props` | [`TextProperties`](../interfaces/client_screen_screenText_TextProperties.md) |

#### Returns

`void`

#### Defined in

[client/screen/screenText.ts:85](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/client/screen/screenText.ts#L85)

___

### getHeight

::: tip Usage
AthenaClient.screen.screenText.**getHeight**(`scale`, `font`): `number`
:::

Get the height of text based on scale and font.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `scale` | `number` |
| `font` | `number` |

#### Returns

`number`

#### Defined in

[client/screen/screenText.ts:68](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/client/screen/screenText.ts#L68)

___

### getWidth

::: tip Usage
AthenaClient.screen.screenText.**getWidth**(`text`, `font`, `scale`): `number`
:::

Get the float width of text. (0.1 - 1)

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `font` | `number` |
| `scale` | `number` |

#### Returns

`number`

#### Defined in

[client/screen/screenText.ts:52](https://github.com/Stuyk/altv-athena/blob/27ff03a/src/core/client/screen/screenText.ts#L52)
