---
title: AthenaClient.screen.marker
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### draw

::: tip Usage
AthenaClient.screen.marker.**draw**(`type`, `pos`, `scale`, `color`, `bobUpAndDown?`, `faceCamera?`, `rotate?`): `void`
:::

Draw a marker in an every tick.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type` | `number` | `undefined` |  |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `scale` | `IVector3` | `undefined` |  |
| `color` | `RGBA` | `undefined` |  |
| `bobUpAndDown` | `boolean` | `false` |  |
| `faceCamera` | `boolean` | `true` |  |
| `rotate` | `boolean` | `false` |  |

#### Returns

`void`

#### Defined in

[client/screen/marker.ts:16](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/client/screen/marker.ts#L16)

___

### drawSimple

::: tip Usage
AthenaClient.screen.marker.**drawSimple**(`type`, `pos`, `rot`, `scale`, `color`, `faceCam`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `number` |
| `pos` | `IVector3` |
| `rot` | `IVector3` |
| `scale` | `IVector3` |
| `color` | `RGBA` |
| `faceCam` | `boolean` |

#### Returns

`void`

#### Defined in

[client/screen/marker.ts:53](https://github.com/Stuyk/altv-athena/blob/3dbae04/src/core/client/screen/marker.ts#L53)
