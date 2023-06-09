---
title: Athena.session.player
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### clearAll

::: tip Usage
Athena.session.player.**clearAll**(`player`): `void`
:::

Clear all keys, and remove all data for a session.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |

#### Returns

`void`

#### Defined in

[server/session/player.ts:122](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/session/player.ts#L122)

___

### clearKey

::: tip Usage
Athena.session.player.**clearKey**(`player`, `key`): `void`
:::

Clear a key from the player.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `any` |
| `key` | keyof `Player` |

#### Returns

`void`

#### Defined in

[server/session/player.ts:100](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/session/player.ts#L100)

___

### get

::: tip Usage
Athena.session.player.**get**<`K`\>(`player`, `key`): `AthenaSession.Player`[`K`] \| `undefined`
:::

Retrieve data from a player's session storage.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `Player` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` |  |
| `key` | `K` | The value you want to get from the player. |

#### Returns

`AthenaSession.Player`[`K`] \| `undefined`

#### Defined in

[server/session/player.ts:59](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/session/player.ts#L59)

___

### getAll

::: tip Usage
Athena.session.player.**getAll**<`K`\>(`key`): `AthenaSession.Player`[`K`][]
:::

Get all player's that have a specific key.

**`Export`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `Player` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`AthenaSession.Player`[`K`][]

#### Defined in

[server/session/player.ts:148](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/session/player.ts#L148)

___

### has

::: tip Usage
Athena.session.player.**has**(`player`, `key`): `boolean`
:::

Returns true, if it has any value set for a given key.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `key` | keyof `Player` |

#### Returns

`boolean`

#### Defined in

[server/session/player.ts:81](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/session/player.ts#L81)

___

### set

::: tip Usage
Athena.session.player.**set**<`K`\>(`player`, `key`, `value`): `void`
:::

Set data for a player's session

This data is not persistent, and automatically clears on disconnect / player destroy

#### Example
```ts
declare global {
    namespace AthenaSession {
        export interface Player {
            myCustomValue: boolean;
        }
    }
}

Athena.session.player.set(somePlayer, 'myCustomValue', true);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `Player` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` |  |
| `key` | keyof `Player` | The key you want to put the value under |
| `value` | `Player`[`K`] | The value you want to set |

#### Returns

`void`

#### Defined in

[server/session/player.ts:36](https://github.com/Stuyk/altv-athena/blob/0a4b65e/src/core/server/session/player.ts#L36)
