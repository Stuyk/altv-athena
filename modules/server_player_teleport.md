---
title: Athena.player.teleport
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### goto

::: tip Usage
Athena.player.teleport.**goto**(`player`, `target`): `void`
:::

Teleport first player to second player.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `target` | `any` |

#### Returns

`void`

#### Defined in

[server/player/teleport.ts:11](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/player/teleport.ts#L11)

___

### manyPlayersToAnotherPlayer

::: tip Usage
Athena.player.teleport.**manyPlayersToAnotherPlayer**(`target`, `players`): `void`
:::

Teleport many players to the a player.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `Player` |
| `players` | `string`[] \| `Player`[] \| `number`[] |

#### Returns

`void`

#### Defined in

[server/player/teleport.ts:50](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/player/teleport.ts#L50)

___

### toMe

::: tip Usage
Athena.player.teleport.**toMe**(`player`, `target`): `void`
:::

Teleport second player to first player.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `target` | `any` |

#### Returns

`void`

#### Defined in

[server/player/teleport.ts:31](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/player/teleport.ts#L31)

___

### toPosition

::: tip Usage
Athena.player.teleport.**toPosition**(`player`, `pos`): `void`
:::

Teleport a player to a position.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `pos` | `IVector3` |

#### Returns

`void`

#### Defined in

[server/player/teleport.ts:78](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/player/teleport.ts#L78)

___

### toVehicle

::: tip Usage
Athena.player.teleport.**toVehicle**(`player`, `vehicle`): `void`
:::

Teleport a player to a vehicle.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `vehicle` | `Vehicle` |

#### Returns

`void`

#### Defined in

[server/player/teleport.ts:63](https://github.com/Stuyk/altv-athena/blob/90cd63d/src/core/server/player/teleport.ts#L63)
