---
title: AthenaShared.interfaces.marker.Marker
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[shared/interfaces/marker](../modules/shared_interfaces_marker.md).Marker

Used to pass marker information from server to client.

**`Interface`**

Marker

## Properties

### bobUpAndDown

• `Optional` **bobUpAndDown**: `boolean`

Should the marker be slightly animated.

#### Defined in

[shared/interfaces/marker.ts:65](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L65)

___

### color

• **color**: `RGBA`

The color of the marker. All values are 0 - 255.

#### Defined in

[shared/interfaces/marker.ts:30](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L30)

___

### dimension

• `Optional` **dimension**: `number`

The dimension to display this marker in.

#### Defined in

[shared/interfaces/marker.ts:58](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L58)

___

### faceCamera

• `Optional` **faceCamera**: `boolean`

Should the marker face the player's camera.

#### Defined in

[shared/interfaces/marker.ts:72](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L72)

___

### maxDistance

• `Optional` **maxDistance**: `number`

The max distance to render this marker.

#### Defined in

[shared/interfaces/marker.ts:44](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L44)

___

### pos

• **pos**: `IVector3`

Position of the Object in a 3D space.

#### Defined in

[shared/interfaces/marker.ts:16](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L16)

___

### rotate

• `Optional` **rotate**: `boolean`

Should the marker rotate to face the player.

#### Defined in

[shared/interfaces/marker.ts:79](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L79)

___

### scale

• `Optional` **scale**: `IVector3`

The scale of this marker.

#### Defined in

[shared/interfaces/marker.ts:37](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L37)

___

### type

• **type**: `number`

The Marker Type Associated with this Marker

#### Defined in

[shared/interfaces/marker.ts:23](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L23)

___

### uid

• `Optional` **uid**: `string`

The unique identifier for this marker.

#### Defined in

[shared/interfaces/marker.ts:51](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/shared/interfaces/marker.ts#L51)
