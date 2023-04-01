---
title: AthenaShared.interfaces.iObject.IObject
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/iObject](../modules/shared_interfaces_iObject.md).IObject

Used to pass object information from server to client.

**`Interface`**

IObject

## Properties

### dimension

• `Optional` **dimension**: `number`

Will show across all dimensions.

#### Defined in

[shared/interfaces/iObject.ts:60](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L60)

___

### maxDistance

• `Optional` **maxDistance**: `number`

The max distance this object should render at.

#### Defined in

[shared/interfaces/iObject.ts:53](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L53)

___

### model

• **model**: `string`

The model name this object.

#### Defined in

[shared/interfaces/iObject.ts:39](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L39)

___

### noCollision

• `Optional` **noCollision**: `boolean`

Should this object have no collision?

#### Defined in

[shared/interfaces/iObject.ts:67](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L67)

___

### pos

• **pos**: `IVector3`

Position of the Object in a 3D space.

#### Defined in

[shared/interfaces/iObject.ts:32](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L32)

___

### rot

• `Optional` **rot**: `IVector3`

The rotation of this object.

#### Defined in

[shared/interfaces/iObject.ts:46](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L46)

___

### subType

• `Optional` **subType**: `string`

Use this parameter to help you identify what this item does on client-side.

Useful for wheel menu based functionality.

#### Defined in

[shared/interfaces/iObject.ts:25](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L25)

___

### uid

• `Optional` **uid**: `string`

A unique identifier for this object.

#### Defined in

[shared/interfaces/iObject.ts:15](https://github.com/Stuyk/altv-athena/blob/b36eb29/src/core/shared/interfaces/iObject.ts#L15)
