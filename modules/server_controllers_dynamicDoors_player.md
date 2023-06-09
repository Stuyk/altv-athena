---
title: Athena.controllers.dynamicDoors.player
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### isLoading

::: tip Usage
Athena.controllers.dynamicDoors.player.**isLoading**(`player`): `any`
:::

Check if a player is loading a door currently.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/controllers/dynamicDoors/player.ts:40](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/controllers/dynamicDoors/player.ts#L40)

___

### register

::: tip Usage
Athena.controllers.dynamicDoors.player.**register**(`player`): `void`
:::

Register a player to start loading a door.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/controllers/dynamicDoors/player.ts:29](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/controllers/dynamicDoors/player.ts#L29)

___

### unregister

::: tip Usage
Athena.controllers.dynamicDoors.player.**unregister**(`player`): `void`
:::

Unregister a player that is loading.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/controllers/dynamicDoors/player.ts:19](https://github.com/Stuyk/altv-athena/blob/380b7cf/src/core/server/controllers/dynamicDoors/player.ts#L19)
