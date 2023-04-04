---
title: AthenaShared.interfaces.appearance.Appearance
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/appearance](../modules/shared_interfaces_appearance.md).Appearance

This interface is used to describe the overall Character Appearance.

**`Interface`**

Appearance

## Properties

### chestHair

• **chestHair**: `number`

The chest hair on a character.
This will not show without opacity being set.

#### Defined in

[shared/interfaces/appearance.ts:158](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L158)

___

### chestHairColor1

• **chestHairColor1**: `number`

The colors of the chest hair.

#### Defined in

[shared/interfaces/appearance.ts:173](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L173)

___

### chestHairOpacity

• **chestHairOpacity**: `number`

How visible chest hair should be.
Values 0.0 to 1.0

#### Defined in

[shared/interfaces/appearance.ts:166](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L166)

___

### colorOverlays

• **colorOverlays**: [`ColorInfo`](shared_interfaces_appearance_ColorInfo.md)[]

These have to do with makeup, lipstick, etc.

#### Defined in

[shared/interfaces/appearance.ts:195](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L195)

___

### eyebrows

• **eyebrows**: `number`

The eyebrows on a character.
This will not show without opacity being set.

#### Defined in

[shared/interfaces/appearance.ts:135](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L135)

___

### eyebrowsColor1

• **eyebrowsColor1**: `number`

The colors of the eyebrows.

#### Defined in

[shared/interfaces/appearance.ts:150](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L150)

___

### eyebrowsOpacity

• **eyebrowsOpacity**: `number`

How visible eyebrows should be.
Values 0.0 to 1.0

#### Defined in

[shared/interfaces/appearance.ts:143](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L143)

___

### eyes

• **eyes**: `number`

Eye Color

#### Defined in

[shared/interfaces/appearance.ts:180](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L180)

___

### faceFather

• **faceFather**: `number`

Values range from 0 to 45

#### Defined in

[shared/interfaces/appearance.ts:20](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L20)

___

### faceMix

• **faceMix**: `number`

The mix of the mother and father faces.
Values range from 0.0 to 1.0

#### Defined in

[shared/interfaces/appearance.ts:49](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L49)

___

### faceMother

• **faceMother**: `number`

Values range from 0 to 45

#### Defined in

[shared/interfaces/appearance.ts:27](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L27)

___

### facialHair

• **facialHair**: `number`

The facial hair to show on the character.
This will not show without opacity being set.

#### Defined in

[shared/interfaces/appearance.ts:112](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L112)

___

### facialHairColor1

• **facialHairColor1**: `number`

Facial hair color for facial hair.

#### Defined in

[shared/interfaces/appearance.ts:119](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L119)

___

### facialHairOpacity

• **facialHairOpacity**: `number`

How visible the facial hair should be.
Values 0.0 to 1.0

#### Defined in

[shared/interfaces/appearance.ts:127](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L127)

___

### hair

• **hair**: `number`

The hair identifier that this character will be using.
Should be a relative id to the dlc hash.

#### Defined in

[shared/interfaces/appearance.ts:74](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L74)

___

### hairColor1

• **hairColor1**: `number`

The color of the hair.

#### Defined in

[shared/interfaces/appearance.ts:89](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L89)

___

### hairColor2

• **hairColor2**: `number`

The highlight color of the hair.

#### Defined in

[shared/interfaces/appearance.ts:96](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L96)

___

### hairDlc

• **hairDlc**: `number`

The dlc hash of the hair to use.

#### Defined in

[shared/interfaces/appearance.ts:82](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L82)

___

### hairOverlay

• **hairOverlay**: `Object`

Some hair has a 'shaved look' to it and this is used to
achieve that look.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `overlay` | `string` |

#### Defined in

[shared/interfaces/appearance.ts:104](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L104)

___

### opacityOverlays

• **opacityOverlays**: [`AppearanceInfo`](shared_interfaces_appearance_AppearanceInfo.md)[]

These have to do with skin appearance more than anything.
Blemishes, moles, etc.

#### Defined in

[shared/interfaces/appearance.ts:188](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L188)

___

### sex

• **sex**: `number`

0 - Female, 1 - Male

#### Defined in

[shared/interfaces/appearance.ts:13](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L13)

___

### skinFather

• **skinFather**: `number`

Values range from 0 to 45

#### Defined in

[shared/interfaces/appearance.ts:34](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L34)

___

### skinMix

• **skinMix**: `number`

The mix of the mother and father faces.
Values range from 0.0 to 1.0

#### Defined in

[shared/interfaces/appearance.ts:57](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L57)

___

### skinMother

• **skinMother**: `number`

Values range from 0 to 45

#### Defined in

[shared/interfaces/appearance.ts:41](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L41)

___

### structure

• **structure**: `number`[]

An array of valid face structure changes.
Each position in the array represents a structure change.
Values range from -1.0 to 1.0

#### Defined in

[shared/interfaces/appearance.ts:66](https://github.com/Stuyk/altv-athena/blob/d77637c/src/core/shared/interfaces/appearance.ts#L66)
