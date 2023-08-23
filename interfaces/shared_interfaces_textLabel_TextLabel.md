---
title: AthenaShared.interfaces.textLabel.TextLabel
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/textLabel](../modules/shared_interfaces_textLabel.md).TextLabel

Used to describe a text label. Passed from server to client.

**`Interface`**

TextLabel

## Properties

### dimension

• `Optional` **dimension**: `number`

The dimension to show this text label in.

#### Defined in

[shared/interfaces/textLabel.ts:43](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/shared/interfaces/textLabel.ts#L43)

___

### isServerWide

• `Optional` **isServerWide**: `boolean`

Always set to true when creating a server-wide text label.

#### Defined in

[shared/interfaces/textLabel.ts:51](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/shared/interfaces/textLabel.ts#L51)

___

### maxDistance

• `Optional` **maxDistance**: `number`

The maximum distance this text label should render at.

#### Defined in

[shared/interfaces/textLabel.ts:29](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/shared/interfaces/textLabel.ts#L29)

___

### pos

• **pos**: `IVector3`

The position where to place the TextLabel in a 3D space.

#### Defined in

[shared/interfaces/textLabel.ts:15](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/shared/interfaces/textLabel.ts#L15)

___

### text

• **text**: `string`

The 'Text' to show on this text label.

#### Defined in

[shared/interfaces/textLabel.ts:22](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/shared/interfaces/textLabel.ts#L22)

___

### uid

• `Optional` **uid**: `string`

The unique identifier to remove this text label if necessary.

#### Defined in

[shared/interfaces/textLabel.ts:36](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/shared/interfaces/textLabel.ts#L36)
