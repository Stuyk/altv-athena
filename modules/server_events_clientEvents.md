---
title: Athena.events.clientEvents
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### on

::: tip Usage
Athena.events.clientEvents.**on**(`eventName`, `callback`): `void`
:::

Trigger a callback specific to Athena Player Events.

**`Static`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `WAYPOINT` |
| `callback` | (`player`: `Player`, ...`args`: `any`[]) => `void` |

#### Returns

`void`

#### Defined in

[server/events/clientEvents.ts:23](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/events/clientEvents.ts#L23)

___

### trigger

::: tip Usage
Athena.events.clientEvents.**trigger**(`eventName`, `player`, `...args`): `void`
:::

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `WAYPOINT` |
| `player` | `Player` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[server/events/clientEvents.ts:6](https://github.com/Stuyk/altv-athena/blob/ed495cc/src/core/server/events/clientEvents.ts#L6)
