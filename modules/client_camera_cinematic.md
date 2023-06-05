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
AthenaClient.camera.cinematic.**addNode**(`node`): `any`
:::

Add a camera node to the camera set.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md) |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:327](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L327)

___

### destroy

::: tip Usage
AthenaClient.camera.cinematic.**destroy**(): `Promise`<`void`\>
:::

This function will destroy all camera instances

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:305](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L305)

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

[client/camera/cinematic.ts:357](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L357)

___

### override

::: tip Usage
AthenaClient.camera.cinematic.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"addNode"`` |
| `callback` | (`node`: [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md)) => `any` |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:412](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L412)

::: tip Usage
AthenaClient.camera.cinematic.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"destroy"`` |
| `callback` | () => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:413](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L413)

::: tip Usage
AthenaClient.camera.cinematic.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"overrideNodes"`` |
| `callback` | (`_nodes`: [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md)[]) => `any` |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:414](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L414)

::: tip Usage
AthenaClient.camera.cinematic.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"next"`` |
| `callback` | (`removeFromArray?`: `boolean`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:415](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L415)

::: tip Usage
AthenaClient.camera.cinematic.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"play"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:416](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L416)

___

### overrideNodes

::: tip Usage
AthenaClient.camera.cinematic.**overrideNodes**(`_nodes`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `_nodes` | [`iCameraNode`](../interfaces/client_camera_cinematic_iCameraNode.md)[] |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:313](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L313)

___

### play

::: tip Usage
AthenaClient.camera.cinematic.**play**(): `any`
:::

Play all camera nodes, but do not clear the camera nodes array.

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:390](https://github.com/Stuyk/altv-athena/blob/7cb341a/src/core/client/camera/cinematic.ts#L390)
