---
title: AthenaClient.screen.texture
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### drawTexture

::: tip Usage
AthenaClient.screen.texture.**drawTexture**(`dictionary`, `name`, `position`, `scale?`): `void`
:::

Draw a texture in-world from a GTA:V file, or DLC

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dictionary` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `position` | `Vector3` | `undefined` |
| `scale?` | `number` | `1` |

#### Returns

`void`

#### Defined in

[client/screen/texture.ts:74](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/client/screen/texture.ts#L74)

___

### drawTexture2D

::: tip Usage
AthenaClient.screen.texture.**drawTexture2D**(`dictionary`, `name`, `position`, `scale?`, `opacity?`): `void`
:::

Draw a texture on-screen from a GTA:V file or DLC

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dictionary` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `position` | `IVector2` | `undefined` |
| `scale?` | `number` | `1` |
| `opacity?` | `number` | `255` |

#### Returns

`void`

#### Defined in

[client/screen/texture.ts:17](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/client/screen/texture.ts#L17)
