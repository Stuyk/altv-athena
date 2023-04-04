---
title: Athena.config.playerConfig
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Variables

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `set` | <CustomKeys\>(`player`: `Player`, `key`: `any`, `value`: `any`) => `void` |

#### Defined in

[server/config/playerConfig.ts:25](https://github.com/Stuyk/altv-athena/blob/a06179b/src/core/server/config/playerConfig.ts#L25)

## Functions

### set

::: tip Usage
Athena.config.playerConfig.**set**<`CustomKeys`\>(`player`, `key`, `value`): `void`
:::

Set a value to auto-sync to client.
Provides type safety for setting predictable keys.
Wraps up the player.setLocalMeta function.

#### Example
```ts
export type ExtendedKeys = 'hello-world' | 'wanted-level' | 'bitcoins';

Athena.config.set<ExtendedKeys>('wanted-level', 5);
```

#### Type parameters

| Name |
| :------ |
| `CustomKeys` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `key` | `any` |  |
| `value` | `any` |  |

#### Returns

`void`

#### Defined in

[server/config/playerConfig.ts:21](https://github.com/Stuyk/altv-athena/blob/a06179b/src/core/server/config/playerConfig.ts#L21)
