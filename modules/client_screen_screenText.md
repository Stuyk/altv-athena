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

▸ **addLongString**(`text`): `void`

Used as a utility for string length.

**`Static`**

**`Memberof`**

ScreenText

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`void`

#### Defined in

[client/screen/screenText.ts:22](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/screen/screenText.ts#L22)

___

### drawTextWithBackground

▸ **drawTextWithBackground**(`text`, `x`, `y`, `scale`, `font`, `background`, `foreground`, `props`): `void`

Draw text with a background and apply padding.

**`Static`**

**`Memberof`**

ScreenText

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

[client/screen/screenText.ts:85](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/screen/screenText.ts#L85)

___

### getHeight

▸ **getHeight**(`scale`, `font`): `number`

Get the height of text based on scale and font.

**`Static`**

**`Memberof`**

ScreenText

#### Parameters

| Name | Type |
| :------ | :------ |
| `scale` | `number` |
| `font` | `number` |

#### Returns

`number`

#### Defined in

[client/screen/screenText.ts:68](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/screen/screenText.ts#L68)

___

### getWidth

▸ **getWidth**(`text`, `font`, `scale`): `number`

Get the float width of text. (0.1 - 1)

**`Static`**

**`Memberof`**

ScreenText

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `font` | `number` |
| `scale` | `number` |

#### Returns

`number`

#### Defined in

[client/screen/screenText.ts:52](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/client/screen/screenText.ts#L52)
