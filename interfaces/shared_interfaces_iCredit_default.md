---
title: AthenaShared.interfaces.iCredit.default
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/iCredit](../modules/shared_interfaces_iCredit.md).default

Used when passing custom 'credit' overlays from server to client.

**`Interface`**

ICredit

## Properties

### align

• `Optional` **align**: `string`

The alignment of the credits. Defaults to left.

#### Defined in

[shared/interfaces/iCredit.ts:39](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/shared/interfaces/iCredit.ts#L39)

___

### duration

• **duration**: `number`

How long should this display for in milliseconds.
Use -1 to set forever.

#### Defined in

[shared/interfaces/iCredit.ts:32](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/shared/interfaces/iCredit.ts#L32)

___

### name

• **name**: `string`

Text below the role.
Can use GTA Colors.

#### Defined in

[shared/interfaces/iCredit.ts:24](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/shared/interfaces/iCredit.ts#L24)

___

### role

• **role**: `string`

Larger blue text to display.
CANNOT use GTA Colors like ~r~

#### Defined in

[shared/interfaces/iCredit.ts:16](https://github.com/Stuyk/altv-athena/blob/16c490d/src/core/shared/interfaces/iCredit.ts#L16)
