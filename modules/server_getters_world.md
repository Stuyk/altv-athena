---
title: Athena.getters.world
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### isInOceanWater

::: tip Usage
Athena.getters.world.**isInOceanWater**(`entity`): `boolean`
:::

Used to check if an entity is in ocean water.
Uses a simple 'z' positional check and dimension check.

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `Entity` |

#### Returns

`boolean`

#### Defined in

[server/getters/world.ts:40](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/getters/world.ts#L40)

___

### positionIsClear

::: tip Usage
Athena.getters.world.**positionIsClear**(`pos`, `lookFor`): `Promise`<`boolean`\>
:::

Check if a world position is free of vehicles.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pos` | `IVector3` | A position in the world. |
| `lookFor` | ``"vehicle"`` \| ``"player"`` \| ``"all"`` | - |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[server/getters/world.ts:10](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/getters/world.ts#L10)
