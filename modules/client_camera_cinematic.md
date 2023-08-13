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

[client/camera/cinematic.ts:327](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L327)

___

### destroy

::: tip Usage
AthenaClient.camera.cinematic.**destroy**(): `Promise`<`void`\>
:::

This function will destroy all camera instances

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/cinematic.ts:305](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L305)

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

[client/camera/cinematic.ts:357](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L357)

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

[client/camera/cinematic.ts:490](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L490)

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

[client/camera/cinematic.ts:491](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L491)

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

[client/camera/cinematic.ts:492](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L492)

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

[client/camera/cinematic.ts:493](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L493)

::: tip Usage
AthenaClient.camera.cinematic.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"switchNode"`` |
| `callback` | (`index`: `number`, `removeFromArray?`: `boolean`) => `Promise`<`boolean` \| (index: number, removeFromArray?: boolean) =\> Promise<boolean \| typeof switchNode\>\> |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:494](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L494)

::: tip Usage
AthenaClient.camera.cinematic.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"previous"`` |
| `callback` | (`removeFromArray?`: `boolean`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:495](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L495)

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

[client/camera/cinematic.ts:496](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L496)

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

[client/camera/cinematic.ts:313](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L313)

___

### play

::: tip Usage
AthenaClient.camera.cinematic.**play**(): `any`
:::

Play all camera nodes, but do not clear the camera nodes array.

#### Returns

`any`

#### Defined in

[client/camera/cinematic.ts:466](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L466)

___

### previous

::: tip Usage
AthenaClient.camera.cinematic.**previous**(`removeFromArray?`): `Promise`<`boolean`\>
:::

Goes to the previous camera.

If `false` is passed in the function it will not remove a camera
from the camera array. Allows for repeating camera movement over and over.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `removeFromArray?` | `boolean` | `true` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/camera/cinematic.ts:433](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L433)

___

### switchNode

::: tip Usage
AthenaClient.camera.cinematic.**switchNode**(`index`, `removeFromArray?`): `Promise`<`boolean` \| (`index`: `number`, `removeFromArray?`: `boolean`) => `Promise`<`boolean` \| (index: number, removeFromArray?: boolean) =\> Promise<boolean \| typeof switchNode\>\>\>
:::

Goes to the index specified camera.

If `false` is passed in the function it will not remove a camera
from the camera array. Allows for repeating camera movement over and over.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `index` | `number` | `undefined` |
| `removeFromArray?` | `boolean` | `true` |

#### Returns

`Promise`<`boolean` \| (`index`: `number`, `removeFromArray?`: `boolean`) => `Promise`<`boolean` \| (index: number, removeFromArray?: boolean) =\> Promise<boolean \| typeof switchNode\>\>\>

#### Defined in

[client/camera/cinematic.ts:395](https://github.com/Stuyk/altv-athena/blob/70801b3/src/core/client/camera/cinematic.ts#L395)
