---
title: Athena.player.sync
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### appearance

::: Tip
Athena.player.sync.**appearance**(`player`): `any`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:27](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L27)

___

### currencyData

::: Tip
Athena.player.sync.**currencyData**(`player`): `void`
:::

Synchronize currency data like bank, cash, etc.

**`Memberof`**

SyncPrototype

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/player/sync.ts:13](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L13)

___

### override

::: Tip
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"currencyData"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:159](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L159)

::: Tip
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"appearance"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:160](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L160)

::: Tip
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"syncedMeta"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:161](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L161)

::: Tip
Athena.player.sync.**override**(`functionName`, `callback`): `any`
:::

Used to override any sync functions

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"playTime"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:162](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L162)

___

### playTime

::: Tip
Athena.player.sync.**playTime**(`player`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/player/sync.ts:139](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L139)

___

### syncedMeta

::: Tip
Athena.player.sync.**syncedMeta**(`player`): `void`
:::

Updates synced meta for the current player.
Basically updates data that may not be fully accessible everywhere.

**`Memberof`**

SyncPrototype

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/player/sync.ts:130](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/player/sync.ts#L130)
