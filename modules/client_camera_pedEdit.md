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

[client/camera/pedEdit.ts:82](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L82)

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

[client/camera/pedEdit.ts:26](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L26)

___

### destroy

::: tip Usage
AthenaClient.camera.pedEdit.**destroy**(): `Promise`<`void`\>
:::

Destroy the Ped Edit Camera

**`Static`**

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/pedEdit.ts:119](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L119)

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

[client/camera/pedEdit.ts:151](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L151)

___

### exists

::: tip Usage
AthenaClient.camera.pedEdit.**exists**(): `boolean`
:::

Check if a PedEditCamera exists.

**`Static`**

#### Returns

`boolean`

#### Defined in

[client/camera/pedEdit.ts:110](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L110)

___

### handleControls

::: tip Usage
AthenaClient.camera.pedEdit.**handleControls**(): `void`
:::

#### Returns

`void`

#### Defined in

[client/camera/pedEdit.ts:228](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L228)

___

### runQueue

::: tip Usage
AthenaClient.camera.pedEdit.**runQueue**(): `Promise`<`void`\>
:::

#### Returns

`Promise`<`void`\>

#### Defined in

[client/camera/pedEdit.ts:173](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L173)

___

### setCamParams

::: tip Usage
AthenaClient.camera.pedEdit.**setCamParams**(`_zpos?`, `_fov?`, `_easeTime?`): `void`
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

`void`

#### Defined in

[client/camera/pedEdit.ts:161](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L161)

___

### setCameraOffset

::: tip Usage
AthenaClient.camera.pedEdit.**setCameraOffset**(`offset`): `void`
:::

Sets up the camera with the original position and a new offset.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `IVector3` |

#### Returns

`void`

#### Defined in

[client/camera/pedEdit.ts:97](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L97)

___

### update

::: tip Usage
AthenaClient.camera.pedEdit.**update**(`id`): `void`
:::

Update the ScriptID for who we should use to rotate.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `number` |

#### Returns

`void`

#### Defined in

[client/camera/pedEdit.ts:224](https://github.com/Stuyk/altv-athena/blob/75aefbb/src/core/client/camera/pedEdit.ts#L224)
