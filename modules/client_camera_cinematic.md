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

::: tip Usage
AthenaClient.camera.cinematic.**addNode**(`node`): `Promise`<`void`\>
:::

Add a camera node to the camera set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:319](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/client/camera/cinematic.ts#L319)

___

### destroy

::: tip Usage
AthenaClient.camera.cinematic.**destroy**(): `Promise`<`void`\>
:::

This function will destroy all camera instances

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:305](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/client/camera/cinematic.ts#L305)

___

### next

::: tip Usage
AthenaClient.camera.cinematic.**next**(`removeFromArray?`): `Promise`<`boolean`\>
:::

Goes to the next camera.

If `false` is passed in the function it will not remove a camera
from the camera array. Allows for repeating camera movement over and over.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `removeFromArray?` | `boolean` | `true` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/camera/cinematic.ts:345](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/client/camera/cinematic.ts#L345)

___

### overrideNodes

::: tip Usage
AthenaClient.camera.cinematic.**overrideNodes**(`_nodes`): `Promise`<`void`\>
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `_nodes` | [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:309](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/client/camera/cinematic.ts#L309)

___

### play

::: tip Usage
AthenaClient.camera.cinematic.**play**(): `Promise`<`void`\>
:::

Play all camera nodes, but do not clear the camera nodes array.

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:374](https://github.com/Stuyk/altv-athena/blob/84a2fd9/src/core/client/camera/cinematic.ts#L374)
