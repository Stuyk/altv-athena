---
title: AthenaShared.interfaces.blip.Blip
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/blip](../modules/shared_interfaces_blip.md).Blip

Used when passing a blip from server-side to client-side.

**`Interface`**

Blip

## Properties

### category

• `Optional` **category**: `number`

Another identifier field for the blip.
1 = No Text on blip or Distance
2 = Text on blip
3 = No text, just distance
7 = Other players %name% (%distance%)
10 = Property
11 = Occupied property
12+ No Text on blip or distance

#### Defined in

[shared/interfaces/blip.ts:67](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L67)

___

### color

• **color**: `number`

The color of this

#### Defined in

[shared/interfaces/blip.ts:39](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L39)

___

### identifier

• `Optional` **identifier**: `string`

An identifier for the blip.

#### Defined in

[shared/interfaces/blip.ts:74](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L74)

___

### pos

• **pos**: `IVector3`

The 3D position of the blip on the map.

#### Defined in

[shared/interfaces/blip.ts:16](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L16)

___

### scale

• **scale**: `number`

The scale of this blip.

#### Defined in

[shared/interfaces/blip.ts:53](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L53)

___

### shortRange

• **shortRange**: `boolean`

Set this to true if you don't want it on the map all of the time.

#### Defined in

[shared/interfaces/blip.ts:23](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L23)

___

### sprite

• **sprite**: `number`

The blip appearance which is known as a 'sprite'.
Do not use `1` as it can have side effects.
https://docs.fivem.net/docs/game-references/blips/

#### Defined in

[shared/interfaces/blip.ts:32](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L32)

___

### text

• **text**: `string`

The text / name of this blip. Can be whatever.

#### Defined in

[shared/interfaces/blip.ts:46](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L46)

___

### uid

• `Optional` **uid**: `string`

Another identifier field for the blip.

#### Defined in

[shared/interfaces/blip.ts:81](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/shared/interfaces/blip.ts#L81)
