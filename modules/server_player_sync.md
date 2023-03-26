---
title: Athena.player.sync
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### appearance

▸ **appearance**(`player`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`any`

#### Defined in

[server/player/sync.ts:27](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L27)

___

### currencyData

▸ **currencyData**(`player`): `void`

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

[server/player/sync.ts:13](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L13)

___

### override

▸ **override**(`functionName`, `callback`): `any`

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

[server/player/sync.ts:159](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L159)

▸ **override**(`functionName`, `callback`): `any`

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

[server/player/sync.ts:160](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L160)

▸ **override**(`functionName`, `callback`): `any`

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

[server/player/sync.ts:161](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L161)

▸ **override**(`functionName`, `callback`): `any`

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

[server/player/sync.ts:162](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L162)

___

### playTime

▸ **playTime**(`player`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/player/sync.ts:139](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L139)

___

### syncedMeta

▸ **syncedMeta**(`player`): `void`

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

[server/player/sync.ts:130](https://github.com/Stuyk/altv-athena/blob/627294b/src/core/server/player/sync.ts#L130)
