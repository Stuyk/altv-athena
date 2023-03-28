---
title: AthenaShared.interfaces.iWorldNotification.IWorldNotification
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/iWorldNotification](../modules/shared_interfaces_iWorldNotification.md).IWorldNotification

Used to pass an in-world marker from server to client.

**`Interface`**

IWorldNotification

## Properties

### background

• `Optional` **background**: `number`

The background color associated with this notification.
There are at least 30.

#### Defined in

[shared/interfaces/iWorldNotification.ts:38](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/shared/interfaces/iWorldNotification.ts#L38)

___

### dimension

• `Optional` **dimension**: `number`

The dimension to display this IWorldNotification in.

#### Defined in

[shared/interfaces/iWorldNotification.ts:59](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/shared/interfaces/iWorldNotification.ts#L59)

___

### maxDistance

• `Optional` **maxDistance**: `number`

The max distance to render this IWorldNotification.

#### Defined in

[shared/interfaces/iWorldNotification.ts:45](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/shared/interfaces/iWorldNotification.ts#L45)

___

### pos

• **pos**: `IVector3`

Position of the Object in a 3D space.

#### Defined in

[shared/interfaces/iWorldNotification.ts:16](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/shared/interfaces/iWorldNotification.ts#L16)

___

### text

• **text**: `string`

Text to display for this world notification.

#### Defined in

[shared/interfaces/iWorldNotification.ts:23](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/shared/interfaces/iWorldNotification.ts#L23)

___

### type

• **type**: `number`

The IWorldNotification Type Associated with this IWorldNotification

#### Defined in

[shared/interfaces/iWorldNotification.ts:30](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/shared/interfaces/iWorldNotification.ts#L30)

___

### uid

• `Optional` **uid**: `string`

The unique identifier for this IWorldNotification.

#### Defined in

[shared/interfaces/iWorldNotification.ts:52](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/shared/interfaces/iWorldNotification.ts#L52)
