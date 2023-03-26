---
title: AthenaClient.camera.cinematic
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Interfaces

- [iCameraNode](../interfaces/client_camera_cinematic_iCameraNode.md)

## Functions

### addNode

▸ **addNode**(`node`): `Promise`<`void`\>

Add a camera node to the camera set.

**`Memberof`**

CinematicCam

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:319](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/camera/cinematic.ts#L319)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

This function will destroy all camera instances

**`Memberof`**

CinematicCam

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:305](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/camera/cinematic.ts#L305)

___

### next

▸ **next**(`removeFromArray?`): `Promise`<`boolean`\>

Goes to the next camera.

If `false` is passed in the function it will not remove a camera
from the camera array. Allows for repeating camera movement over and over.

**`Memberof`**

CinematicCam

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `removeFromArray?` | `boolean` | `true` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/camera/cinematic.ts:345](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/camera/cinematic.ts#L345)

___

### overrideNodes

▸ **overrideNodes**(`_nodes`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_nodes` | [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:309](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/camera/cinematic.ts#L309)

___

### play

▸ **play**(): `Promise`<`void`\>

Play all camera nodes, but do not clear the camera nodes array.

**`Memberof`**

CinematicCam

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:374](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/client/camera/cinematic.ts#L374)
