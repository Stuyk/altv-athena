---
title: AthenaClient.rmlui.sprites.SpriteInfo
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


[client/rmlui/sprites](../modules/client_rmlui_sprites.md).SpriteInfo

## Properties

### callOnceOnTouch

• `Optional` **callOnceOnTouch**: (`uid`: `string`) => `void`

#### Type declaration

::: tip Usage
AthenaClient.rmlui.sprites.SpriteInfo.(`uid`): `void`
:::

Call this callback once, when the sprite is touched.

##### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

##### Returns

`void`

#### Defined in

[client/rmlui/sprites/index.ts:55](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/client/rmlui/sprites/index.ts#L55)

___

### height

• **height**: `number`

The height of the image. Pixels.

#### Defined in

[client/rmlui/sprites/index.ts:40](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/client/rmlui/sprites/index.ts#L40)

___

### path

• **path**: `string`

The path of the image we want to draw.
Use `@plugin/plugin-name/client/image.png` for plugin based pathing.
Otherwise paths are based on `../../../plugins/plugin-name/client/image.png`.

#### Defined in

[client/rmlui/sprites/index.ts:24](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/client/rmlui/sprites/index.ts#L24)

___

### position

• **position**: `IVector3`

A position in-world, or on-screen where to draw this image.

#### Defined in

[client/rmlui/sprites/index.ts:48](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/client/rmlui/sprites/index.ts#L48)

___

### uid

• **uid**: `string`

A unique identifier for this sprite.

#### Defined in

[client/rmlui/sprites/index.ts:14](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/client/rmlui/sprites/index.ts#L14)

___

### width

• **width**: `number`

The width of the image. Pixels.

#### Defined in

[client/rmlui/sprites/index.ts:32](https://github.com/Stuyk/altv-athena/blob/85b158f/src/core/client/rmlui/sprites/index.ts#L32)
