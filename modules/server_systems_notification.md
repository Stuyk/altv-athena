---
title: Athena.systems.notification
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### toAll

::: tip Usage
Athena.systems.notification.**toAll**(`message`, `...args`): `void`
:::

Emit a notification to all players.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[server/systems/notification/index.ts:12](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/systems/notification/index.ts#L12)

___

### toPlayer

::: tip Usage
Athena.systems.notification.**toPlayer**(`player`, `message`, `...args`): `void`
:::

Emit a notification to a single client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `message` | `string` |  |
| `...args` | `any`[] |  |

#### Returns

`void`

#### Defined in

[server/systems/notification/index.ts:29](https://github.com/Stuyk/altv-athena/blob/55b6185/src/core/server/systems/notification/index.ts#L29)
