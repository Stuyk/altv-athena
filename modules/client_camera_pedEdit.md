---
title: AthenaClient.camera.pedEdit
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### calculateCamOffset

::: tip Usage
AthenaClient.camera.pedEdit.**calculateCamOffset**(`offset`): `alt.IVector3`
:::

Calculates a camera offset.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `IVector3` |

#### Returns

`alt.IVector3`

{Vector3}

#### Defined in

[client/camera/pedEdit.ts:86](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L86)

___

### create

::: tip Usage
AthenaClient.camera.pedEdit.**create**(`_scriptID`, `offset?`, `_isLocalPlayer?`): `Promise`<`void`\>
:::

Creates a Pedestrian Edit Camera

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `_scriptID` | `number` | `undefined` |
| `offset?` | `IVector3` | `null` |
| `_isLocalPlayer` | `boolean` | `false` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/pedEdit.ts:26](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L26)

___

### destroy

::: tip Usage
AthenaClient.camera.pedEdit.**destroy**(): `any`
:::

Destroy the Ped Edit Camera

**`Static`**

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:135](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L135)

___

### disableControls

::: tip Usage
AthenaClient.camera.pedEdit.**disableControls**(`status`): `void`
:::

Disable All Controls?

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `boolean` |

#### Returns

`void`

#### Defined in

[client/camera/pedEdit.ts:171](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L171)

___

### exists

::: tip Usage
AthenaClient.camera.pedEdit.**exists**(): `any`
:::

Check if a PedEditCamera exists.

**`Static`**

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:122](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L122)

___

### handleControls

::: tip Usage
AthenaClient.camera.pedEdit.**handleControls**(): `any`
:::

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:264](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L264)

___

### override

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"create"`` |
| `callback` | (`_scriptID`: `number`, `offset?`: `IVector3`, `_isLocalPlayer`: `boolean`) => `Promise`<`void`\> |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:424](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L424)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"destroy"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:425](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L425)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"disableControls"`` |
| `callback` | (`status`: `boolean`) => `void` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:426](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L426)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`id`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:427](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L427)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"handleControls"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:428](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L428)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"exists"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:429](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L429)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"runQueue"`` |
| `callback` | () => `any` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:430](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L430)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setCameraOffset"`` |
| `callback` | (`offset`: `IVector3`) => `any` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:431](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L431)

::: tip Usage
AthenaClient.camera.pedEdit.**override**(`functionName`, `callback`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setCamParams"`` |
| `callback` | (`_zpos`: `number`, `_fov`: `number`, `_easeTime`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:432](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L432)

___

### runQueue

::: tip Usage
AthenaClient.camera.pedEdit.**runQueue**(): `any`
:::

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:201](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L201)

___

### setCamParams

::: tip Usage
AthenaClient.camera.pedEdit.**setCamParams**(`_zpos?`, `_fov?`, `_easeTime?`): `any`
:::

Set the Camera Field of View

**`Static`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `_zpos` | `number` | `null` |
| `_fov` | `number` | `null` |
| `_easeTime` | `number` | `500` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:185](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L185)

___

### setCameraOffset

::: tip Usage
AthenaClient.camera.pedEdit.**setCameraOffset**(`offset`): `any`
:::

Sets up the camera with the original position and a new offset.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `IVector3` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:105](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L105)

___

### update

::: tip Usage
AthenaClient.camera.pedEdit.**update**(`id`): `any`
:::

Update the ScriptID for who we should use to rotate.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`any`

#### Defined in

[client/camera/pedEdit.ts:256](https://github.com/Stuyk/altv-athena/blob/7805c27/src/core/client/camera/pedEdit.ts#L256)
