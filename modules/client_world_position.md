---
title: AthenaClient.world.position
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### getGroundZ

::: tip Usage
AthenaClient.world.position.**getGroundZ**(`pos`, `options?`): `alt.IVector3`
:::

Returns a Vector3 with a modified z position if the ground position is found.

Otherwise, returns the original Vector3.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pos` | `IVector3` | `undefined` | A position in the world. |
| `options?` | `Object` | `DefaultData` |  |
| `options.increment` | `number` | `1` | - |
| `options.iterations` | `number` | `10` | - |
| `options.minStart` | `number` | `5` | - |

#### Returns

`alt.IVector3`

#### Defined in

[client/world/position.ts:21](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/world/position.ts#L21)

___

### isEntityBlockingPosition

::: tip Usage
AthenaClient.world.position.**isEntityBlockingPosition**(`pos`, `range?`, `maxDistance?`): `boolean`
:::

Check if an entity is in front of the position the camera is looking at.
Should be used periodically and not in an every tick. Could be expensive.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pos` | `IVector3` | `undefined` |
| `range` | `number` | `0.8` |
| `maxDistance` | `number` | `100` |

#### Returns

`boolean`

#### Defined in

[client/world/position.ts:43](https://github.com/Stuyk/altv-athena/blob/41bbc82/src/core/client/world/position.ts#L43)
