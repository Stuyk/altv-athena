---
title: AthenaClient.camera.cinematic.iCameraNode
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/camera/cinematic](../modules/client_camera_cinematic.md).iCameraNode

## Properties

### easeTime

• `Optional` **easeTime**: `number`

Time to ease between camera nodes. If only one camera node is present it does not apply.

#### Defined in

[client/camera/cinematic.ts:51](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L51)

___

### entityToAttachTo

• `Optional` **entityToAttachTo**: `number`

The entity to attach this camera to, can be a vehicle, ped, etc.
Use `scriptID` for this.

#### Defined in

[client/camera/cinematic.ts:76](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L76)

___

### entityToTrack

• `Optional` **entityToTrack**: `number`

The entity `scriptID` to follow with the camera.

#### Defined in

[client/camera/cinematic.ts:59](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L59)

___

### fov

• **fov**: `number`

The FOV for the camera. Default is set to 90.

#### Defined in

[client/camera/cinematic.ts:43](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L43)

___

### isLastNode

• `Optional` **isLastNode**: `boolean`

If this is the last camera node, should we destroy the camera after easeTime?

#### Defined in

[client/camera/cinematic.ts:100](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L100)

___

### offset

• `Optional` **offset**: `IVector3`

Applies to entity attachment, and the offset from said entity.

#### Defined in

[client/camera/cinematic.ts:35](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L35)

___

### pedBone

• `Optional` **pedBone**: `number`

A pedestrian bone index to attach to if `entityToAttachTo` is specified

#### Defined in

[client/camera/cinematic.ts:92](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L92)

___

### pos

• **pos**: `IVector3`

Position for where to create this camera.

#### Defined in

[client/camera/cinematic.ts:18](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L18)

___

### positionToTrack

• `Optional` **positionToTrack**: `IVector3`

A position to point that camera towards if applicable.

#### Defined in

[client/camera/cinematic.ts:67](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L67)

___

### rot

• `Optional` **rot**: `IVector3`

Rotation of the camera, if applicable.
Also applies as rotation for entity attachment if applicable.

#### Defined in

[client/camera/cinematic.ts:27](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L27)

___

### vehicleBone

• `Optional` **vehicleBone**: `number`

A vehicle bone index to attach to if `entityToAttachTo` is specified

#### Defined in

[client/camera/cinematic.ts:84](https://github.com/Stuyk/altv-athena/blob/bc77fba/src/core/client/camera/cinematic.ts#L84)
