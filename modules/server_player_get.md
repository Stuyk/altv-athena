---
title: Athena.player.get
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Modules

- [Internal](server_player_get_Internal.md)

## Functions

### accountPermissions

::: tip Usage
Athena.player.get.**accountPermissions**(`player`): `string`[]
:::

Return a list of account permissions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`string`[]

#### Defined in

[server/player/get.ts:144](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L144)

___

### bank

::: tip Usage
Athena.player.get.**bank**(`player`): `any`
:::

Get a characters current bank balance.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/player/get.ts:36](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L36)

___

### cash

::: tip Usage
Athena.player.get.**cash**(`player`): `any`
:::

Get a characters current cash balance.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/player/get.ts:24](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L24)

___

### food

::: tip Usage
Athena.player.get.**food**(`player`): `number`
:::

Get the characters food value.

By default there is no food system in Athena, these values are placeholders.

Returns a readable array, but cannot be modified.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`number`

#### Defined in

[server/player/get.ts:92](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L92)

___

### groups

::: tip Usage
Athena.player.get.**groups**(`player`): `Object`
:::

Return a list of groups, with their dedicated group permissions for this character.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`Object`

#### Defined in

[server/player/get.ts:120](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L120)

___

### inventory

::: tip Usage
Athena.player.get.**inventory**(`player`): [`Readonly`](server_player_get_Internal.md#Readonly)<[`player`](server_config.md#player)[]\>
:::

Get the characters inventory.

Returns a readable array, but cannot be modified.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

[`Readonly`](server_player_get_Internal.md#Readonly)<[`player`](server_config.md#player)[]\>

#### Defined in

[server/player/get.ts:62](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L62)

___

### isDead

::: tip Usage
Athena.player.get.**isDead**(`player`): `boolean`
:::

Check if a character is dead.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`boolean`

#### Defined in

[server/player/get.ts:48](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L48)

___

### job

::: tip Usage
Athena.player.get.**job**(`player`): `Athena.systems.job.builder`
:::

Return the current job instance.

Returns `undefined` if not on a job.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`Athena.systems.job.builder`

#### Defined in

[server/player/get.ts:158](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L158)

___

### name

::: tip Usage
Athena.player.get.**name**(`player`): `any`
:::

Get a characters full character name.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/player/get.ts:12](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L12)

___

### permissions

::: tip Usage
Athena.player.get.**permissions**(`player`): `string`[]
:::

Return a list of character permissions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`string`[]

#### Defined in

[server/player/get.ts:132](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L132)

___

### toolbar

::: tip Usage
Athena.player.get.**toolbar**(`player`): [`Readonly`](server_player_get_Internal.md#Readonly)<[`player`](server_config.md#player)[]\>
:::

Get the characters toolbar.

Returns a readable array, but cannot be modified.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

[`Readonly`](server_player_get_Internal.md#Readonly)<[`player`](server_config.md#player)[]\>

#### Defined in

[server/player/get.ts:76](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L76)

___

### water

::: tip Usage
Athena.player.get.**water**(`player`): `number`
:::

Get the characters water value.

By default there is no water system in Athena, these values are placeholders.

Returns a readable array, but cannot be modified.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`number`

#### Defined in

[server/player/get.ts:108](https://github.com/Stuyk/altv-athena/blob/e7d4753/src/core/server/player/get.ts#L108)
