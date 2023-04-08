---
title: Athena.player.sync
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### appearance

::: tip Usage
Athena.player.sync.**appearance**(`player`, `document?`): `any`
:::

Apply an appearance on a player, or use a selected character document to update.

**`Export`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `player` | `Player` | `undefined` |
| `document?` | `Character` | `undefined` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:36](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L36)

___

### currencyData

::: tip Usage
Athena.player.sync.**currencyData**(`player`): `void`
:::

Synchronize currency data like bank, cash, etc.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/player/sync.ts:14](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L14)

___

### override

::: tip Usage
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"currencyData"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:174](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L174)

::: tip Usage
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"appearance"`` |
| `callback` | (`player`: `Player`, `document?`: `Character`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:175](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L175)

::: tip Usage
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"syncedMeta"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:176](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L176)

::: tip Usage
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"playTime"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:177](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L177)

___

### playTime

::: tip Usage
Athena.player.sync.**playTime**(`player`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/player/sync.ts:154](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L154)

___

### syncedMeta

::: tip Usage
Athena.player.sync.**syncedMeta**(`player`): `void`
:::

Updates synced meta for the current player.
Basically updates data that may not be fully accessible everywhere.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/player/sync.ts:145](https://github.com/Stuyk/altv-athena/blob/b149a44/src/core/server/player/sync.ts#L145)
