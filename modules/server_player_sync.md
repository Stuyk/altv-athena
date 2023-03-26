---
title: Athena.player.sync
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### appearance

::: tip Usage
Athena.player.sync.**appearance**(`player`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:27](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L27)

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

[server/player/sync.ts:13](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L13)

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

[server/player/sync.ts:159](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L159)

::: tip Usage
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"appearance"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:160](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L160)

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

[server/player/sync.ts:161](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L161)

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

[server/player/sync.ts:162](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L162)

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

[server/player/sync.ts:139](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L139)

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

[server/player/sync.ts:130](https://github.com/Stuyk/altv-athena/blob/cdad41b/src/core/server/player/sync.ts#L130)
